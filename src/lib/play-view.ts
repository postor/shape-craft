import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  type SceneComponent,
  type AssetComponent,
  type SceneObject,
  type AnimKf,
  type AnimComponent,
  type RecordTrack,
  sampleTerrainHeight,
  terrainSide,
  ensureTerrainWater,
  vec3,
} from '../schema';
import { buildPartObject, type RefResolver } from './scene-graph.ts';
import { resolveRefs, type RefMap } from './instance.ts';

export type PlayMode = 'fly' | 'ground';

const LOOK_SENSITIVITY = 0.0024;
const PITCH_LIMIT = Math.PI / 2 - 0.05;
const EYE_HEIGHT = 1.7;
/** Recording sample rate (Hz). We store one keyframe per interval of time. */
const SAMPLE_HZ = 30;
const DEFAULT_SPEED = 5;

export interface PlayViewportCallbacks {
  onRecordingChange?: (recording: boolean, objectId: string | null) => void;
  onCameraRecordingChange?: (recording: boolean) => void;
  onArmingChange?: (kind: 'object' | 'camera' | null) => void;
  onSelect?: (objectId: string | null) => void;
  onTracksChange?: () => void;
  onPlayAllChange?: (playing: boolean) => void;
  onVideoChange?: (recording: boolean) => void;
}

/**
 * "扮演视频" (role-play video) viewport.
 *
 * Renders a Scene (terrain + placed asset instances) like the scene editor, but
 * instead of editing it, the user *acts* inside it: pick a placed object, hit
 * record, and drive that object with the first-person WASD + mouse controller
 * (flight or ground mode). Every frame the object's transform is captured into a
 * per-object **track** keyed from t=0. While a new object is being recorded, all
 * previously recorded tracks replay **time-aligned** (everything starts at the
 * same origin t=0), so every object with a track moves together. The collected
 * tracks can be played back as a whole and exported as an Animation component
 * (and/or recorded to a WebM video).
 */
export class PlayViewport {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private clock = new THREE.Clock();

  private cb: PlayViewportCallbacks;

  // Scene model
  private sceneModel: SceneComponent | null = null;
  private assets = new Map<string, AssetComponent>();

  // 3D objects
  private terrainMesh: THREE.Mesh | null = null;
  private waterMesh: THREE.Mesh | null = null;
  private waterLocalMesh: THREE.Mesh | null = null;
  private objectsGroup = new THREE.Group();

  // Per-object live groups + ground offsets (for ground mode).
  private objectGroups = new Map<string, THREE.Object3D>();
  private baseOffsetY = new Map<string, number>();

  // Recorded tracks: objectId -> keyframes (time aligned from t=0).
  private tracks = new Map<string, AnimKf[]>();

  // Selection / placement
  private selectedId: string | null = null;
  private armedAssetId: string | null = null;

  // Controller state
  private mode: PlayMode = 'fly';
  private speed = DEFAULT_SPEED;
  private yaw = 0;
  private pitch = 0;
  private keys = new Set<string>();
  private locked = false;

  // Recording state
  private recording = false;
  private recordObjectId: string | null = null;
  private recordT = 0;
  private recordLastSample = -1;

  // Camera-track recording state (the player acts as the camera).
  private cameraRecording = false;
  private cameraTrack: AnimKf[] | null = null;
  private cameraRecordT = 0;
  private cameraRecordLastSample = -1;

  // "Arming" state: the subject (object or camera) is movable so the player can
  // walk it to the desired start pose, but capture has not begun yet. Pressing
  // Enter begins capture from t=0; Esc cancels and reverts.
  private arming: 'object' | 'camera' | null = null;
  // Clock used to keep previously recorded objects animating while arming.
  private armT = 0;

  // Play-all state
  private playing = false;
  private playT = 0;

  // Video recording
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private videoRecording = false;

  constructor(container: HTMLElement, cb: PlayViewportCallbacks = {}) {
    this.container = container;
    this.cb = cb;

    this.scene.background = new THREE.Color('#10131a');
    this.scene.fog = new THREE.Fog('#10131a', 40, 260);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    this.camera.rotation.order = 'YXZ';
    this.camera.position.set(0, 14, 18);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    const el = this.renderer.domElement;
    el.style.display = 'block';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.cursor = 'default';

    this.controls = new OrbitControls(this.camera, el);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 1, 0);
    this.controls.maxPolarAngle = Math.PI / 2.02;
    this.controls.enabled = true;

    this.scene.add(new THREE.HemisphereLight('#ffffff', '#3a3f4b', 1.0));
    const dir = new THREE.DirectionalLight('#ffffff', 1.5);
    dir.position.set(10, 18, 8);
    this.scene.add(dir);
    this.scene.add(this.objectsGroup);

    el.addEventListener('click', () => this.onCanvasClick());
    el.addEventListener('pointerdown', (e) => {
      (el as unknown as { __lastPointer?: { x: number; y: number } }).__lastPointer = {
        x: e.clientX,
        y: e.clientY,
      };
      this.handlePick(e);
    });
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    document.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('keydown', this.onKeyBound);
    window.addEventListener('keyup', this.onKeyBound);
    window.addEventListener('resize', () => this.resize());
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.container);
    this.resize();
    this.animate();
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  async setScene(scene: SceneComponent, assets: AssetComponent[]): Promise<void> {
    this.sceneModel = scene;
    this.assets = new Map(assets.map((a) => [a.id, a]));
    // Tracks reference this scene's object ids, so drop them on scene switch.
    this.tracks.clear();
    this.cameraTrack = null;
    this.recording = false;
    this.recordObjectId = null;
    this.cameraRecording = false;
    this.playing = false;
    if (scene.terrain) ensureTerrainWater(scene.terrain);
    this.rebuildTerrain();
    this.rebuildWater();
    this.rebuildWaterLocal();
    await this.rebuildObjects();
    const s = scene.size;
    this.camera.position.set(s * 0.6, s * 0.55, s * 0.6);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  setMode(mode: PlayMode) {
    this.mode = mode;
  }

  getMode(): PlayMode {
    return this.mode;
  }

  setSpeed(speed: number) {
    this.speed = Math.max(0.5, speed);
  }

  getSpeed(): number {
    return this.speed;
  }

  setSelected(id: string | null) {
    this.selectedId = id;
    this.refreshSelection();
  }

  getSelectedId(): string | null {
    return this.selectedId;
  }

  /** Arm placement of an asset; the next terrain click drops it into the scene. */
  armPlacement(assetId: string | null) {
    this.armedAssetId = assetId;
    this.renderer.domElement.style.cursor = assetId ? 'crosshair' : 'default';
  }

  deleteSelected() {
    if (!this.selectedId) return;
    const id = this.selectedId;
    this.tracks.delete(id);
    this.objectGroups.delete(id);
    this.baseOffsetY.delete(id);
    const g = this.objectGroups.get(id);
    if (g) this.objectsGroup.remove(g);
    if (this.sceneModel) {
      this.sceneModel.objects = this.sceneModel.objects.filter((o) => o.id !== id);
    }
    this.selectedId = null;
    this.refreshSelection();
    this.cb.onTracksChange?.();
    this.cb.onSelect?.(null);
  }

  isRecording(): boolean {
    return this.recording;
  }

  getRecordingObjectId(): string | null {
    return this.recording ? this.recordObjectId : null;
  }

  /** Arm recording of the selected object: make it movable to pick a start
   * pose, but don't capture yet. Press Enter to begin, Esc to cancel. */
  async startRecording(mode?: PlayMode): Promise<void> {
    if (this.recording || this.arming || !this.selectedId) return;
    if (mode) this.mode = mode;
    this.arming = 'object';
    this.recordObjectId = this.selectedId;
    this.playing = false;
    this.armT = 0;
    const g = this.objectGroups.get(this.selectedId);
    if (g) this.yaw = g.rotation.y;
    this.pitch = 0;
    this.keys.clear();
    this.controls.enabled = false;
    await this.requestLock();
    this.cb.onArmingChange?.('object');
  }

  /** End the current recording, finalizing its track. */
  stopRecording(): void {
    if (!this.recording || !this.recordObjectId) return;
    // Flush a final sample at the current time so the track ends where it stopped.
    this.sampleCurrent(true);
    const kfs = this.tracks.get(this.recordObjectId);
    if (kfs) kfs.sort((a, b) => a.time - b.time);
    this.recording = false;
    this.recordObjectId = null;
    this.controls.enabled = true;
    this.cb.onRecordingChange?.(false, null);
  }

  isPlayingAll(): boolean {
    return this.playing;
  }

  // ---- Camera-track recording ----

  isCameraRecording(): boolean {
    return this.cameraRecording;
  }

  hasCameraTrack(): boolean {
    return !!this.cameraTrack && this.cameraTrack.length > 0;
  }

  /** Arm the camera pass: make the camera movable to pick a start viewpoint,
   * but don't capture yet. Press Enter to begin, Esc to cancel. */
  async startCameraRecording(mode?: PlayMode): Promise<void> {
    if (this.cameraRecording || this.arming) return;
    // A camera pass and an object pass cannot run at the same time.
    if (this.recording) this.stopRecording();
    if (mode) this.mode = mode;
    this.arming = 'camera';
    this.playing = false;
    this.armT = 0;
    // Seed the controller from the camera's current orientation.
    this.yaw = this.camera.rotation.y;
    this.pitch = this.camera.rotation.x;
    this.keys.clear();
    this.controls.enabled = false;
    this.applyCameraRotation();
    await this.requestLock();
    this.cb.onArmingChange?.('camera');
  }

  /** End the camera pass, finalizing the special camera track. */
  stopCameraRecording(): void {
    if (!this.cameraRecording) return;
    this.sampleCamera(true);
    if (this.cameraTrack) this.cameraTrack.sort((a, b) => a.time - b.time);
    this.cameraRecording = false;
    this.controls.enabled = true;
    this.cb.onCameraRecordingChange?.(false);
  }

  /**
   * Confirm the armed pass: begin actually capturing from t=0 at the current
   * pose. Triggered by the Enter key while armed.
   */
  private beginCapture() {
    if (this.arming === 'object') {
      if (!this.recordObjectId) {
        this.cancelArming();
        return;
      }
      this.arming = null;
      this.tracks.set(this.recordObjectId, []);
      this.recordT = 0;
      this.recordLastSample = -1;
      this.recording = true;
      this.sampleCurrent(true);
      this.cb.onArmingChange?.(null);
      this.cb.onRecordingChange?.(true, this.recordObjectId);
    } else if (this.arming === 'camera') {
      this.arming = null;
      this.cameraTrack = [];
      this.cameraRecordT = 0;
      this.cameraRecordLastSample = -1;
      this.cameraRecording = true;
      this.sampleCamera(true);
      this.cb.onArmingChange?.(null);
      this.cb.onCameraRecordingChange?.(true);
    }
  }

  /** Abandon the armed pass without creating a track; revert the scene. */
  private cancelArming() {
    if (!this.arming) return;
    this.arming = null;
    this.recordObjectId = null;
    this.playing = false;
    this.controls.enabled = true;
    this.applySceneDefaults();
    this.cb.onArmingChange?.(null);
  }

  private applyCameraRotation() {
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }

  private moveCamera(dt: number) {
    if (!this.locked) return;
    if (!this.cameraRecording && this.arming !== 'camera') return;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();
    if (this.keys.has('w')) move.add(forward);
    if (this.keys.has('s')) move.sub(forward);
    if (this.keys.has('d')) move.add(right);
    if (this.keys.has('a')) move.sub(right);
    const dist = this.speed * dt;

    if (this.mode === 'fly') {
      const full = new THREE.Vector3();
      this.camera.getWorldDirection(full);
      full.y = 0;
      full.normalize();
      const fly = new THREE.Vector3();
      if (this.keys.has('w')) fly.add(full);
      if (this.keys.has('s')) fly.sub(full);
      const fr = new THREE.Vector3(full.z, 0, -full.x);
      if (this.keys.has('d')) fly.add(fr);
      if (this.keys.has('a')) fly.sub(fr);
      fly.normalize().multiplyScalar(dist);
      this.camera.position.x += fly.x;
      this.camera.position.z += fly.z;
      let v = 0;
      if (this.keys.has(' ')) v += 1;
      if (this.keys.has('shift')) v -= 1;
      this.camera.position.y += v * dist;
    } else {
      if (move.lengthSq() > 0) move.normalize().multiplyScalar(dist);
      this.camera.position.x += move.x;
      this.camera.position.z += move.z;
      if (this.sceneModel) {
        const h = sampleTerrainHeight(this.sceneModel.terrain, this.camera.position.x, this.camera.position.z);
        this.camera.position.y = h + EYE_HEIGHT;
      }
    }
    this.applyCameraRotation();
  }

  private sampleCamera(force = false) {
    if (!this.cameraRecording || !this.cameraTrack) return;
    if (!force && this.cameraRecordT - this.cameraRecordLastSample < 1 / SAMPLE_HZ) return;
    this.cameraRecordLastSample = this.cameraRecordT;
    this.cameraTrack.push({
      time: this.cameraRecordT,
      position: { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z },
      rotation: { x: this.camera.rotation.x, y: this.camera.rotation.y, z: this.camera.rotation.z },
      scale: vec3(1, 1, 1),
    });
  }

  private applyCameraFromTrack(t: number) {
    if (!this.cameraTrack || this.cameraTrack.length === 0) return;
    const s = sampleRecorded(this.cameraTrack, t);
    this.camera.position.set(s.position.x, s.position.y, s.position.z);
    this.camera.rotation.set(s.rotation.x, s.rotation.y, s.rotation.z, 'YXZ');
  }

  /** Apply every recorded object track + the camera track at time `t`. */
  private applyFrame(t: number) {
    this.applyObjectTracks(t);
    if (this.cameraTrack && this.cameraTrack.length > 0) this.applyCameraFromTrack(t);
  }

  /** Play back every recorded track on a loop from t=0. */
  playAll() {
    if (this.tracks.size === 0 && !this.hasCameraTrack()) return;
    this.recording = false;
    this.recordObjectId = null;
    this.cameraRecording = false;
    // Drive the camera from its track when one exists; otherwise orbit freely.
    this.controls.enabled = !this.hasCameraTrack();
    this.playing = true;
    this.playT = 0;
    this.cb.onPlayAllChange?.(true);
  }

  stopPlayAll() {
    this.playing = false;
    this.controls.enabled = true;
    // Restore scene-default transforms once playback stops.
    this.applySceneDefaults();
    this.cb.onPlayAllChange?.(false);
  }

  getDuration(): number {
    let max = 0;
    for (const kfs of this.tracks.values()) {
      const last = kfs[kfs.length - 1];
      if (last && last.time > max) max = last.time;
    }
    if (this.cameraTrack && this.cameraTrack.length > 0) {
      const last = this.cameraTrack[this.cameraTrack.length - 1];
      if (last.time > max) max = last.time;
    }
    return max;
  }

  /** Build an AnimComponent from the recorded tracks (empty if none). */
  buildAnimation(name: string, sceneId: string): AnimComponent | null {
    if (this.tracks.size === 0) return null;
    const now = new Date().toISOString();
    const tracks = [] as AnimComponent['tracks'];
    for (const [objId, kfs] of this.tracks) {
      if (kfs.length === 0) continue;
      const obj = this.sceneModel?.objects.find((o) => o.id === objId);
      tracks.push({
        id: `track_${objId}`,
        kind: 'object',
        objectId: objId,
        label: obj?.name ?? objId,
        keyframes: kfs.map((k) => ({
          time: k.time,
          position: { ...k.position },
          rotation: { ...k.rotation },
          scale: { ...k.scale },
        })),
      });
    }
    if (tracks.length === 0) return null;
    return {
      id: `anim_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      sceneId,
      duration: Math.max(0.1, this.getDuration()),
      tracks,
      createdAt: now,
      updatedAt: now,
    };
  }

  hasTracks(): boolean {
    return this.tracks.size > 0;
  }

  /** Load recorded tracks + camera track from a saved session. */
  loadTracks(tracks: RecordTrack[], cameraTrack: AnimKf[] | null) {
    this.tracks = new Map(tracks.map((t) => [t.objectId, t.keyframes]));
    this.cameraTrack = cameraTrack && cameraTrack.length > 0 ? cameraTrack : null;
    this.cb.onTracksChange?.();
  }

  /** Read out the current tracks + camera track for persistence. */
  getTracksData(): { tracks: RecordTrack[]; cameraTrack: AnimKf[] | null } {
    const tracks: RecordTrack[] = [];
    for (const [objId, kfs] of this.tracks) {
      if (kfs.length === 0) continue;
      const obj = this.sceneModel?.objects.find((o) => o.id === objId);
      tracks.push({ objectId: objId, name: obj?.name ?? objId, keyframes: kfs });
    }
    return { tracks, cameraTrack: this.cameraTrack };
  }

  getTrackSummary(): { objectId: string; name: string; samples: number; duration: number }[] {
    const out: { objectId: string; name: string; samples: number; duration: number }[] = [];
    for (const [objId, kfs] of this.tracks) {
      const obj = this.sceneModel?.objects.find((o) => o.id === objId);
      out.push({
        objectId: objId,
        name: obj?.name ?? objId,
        samples: kfs.length,
        duration: kfs.length ? kfs[kfs.length - 1].time : 0,
      });
    }
    return out;
  }

  async startVideoRecord(): Promise<void> {
    if (this.videoRecording || this.tracks.size === 0) return;
    const canvas = this.renderer.domElement as HTMLCanvasElement;
    const stream = canvas.captureStream(30);
    const mic = await this.requestMic(stream).catch(() => null);
    void mic;
    const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((m) =>
      MediaRecorder.isTypeSupported(m),
    );
    this.recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    this.chunks = [];
    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.recorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `play-${Date.now()}.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    this.recorder.start();
    this.videoRecording = true;
    this.cb.onVideoChange?.(true);
    this.playAll();
  }

  stopVideoRecord(): void {
    if (!this.videoRecording) return;
    this.stopPlayAll();
    if (this.recorder) {
      this.recorder.stop();
      this.recorder = null;
    }
    this.videoRecording = false;
    this.cb.onVideoChange?.(false);
  }

  captureThumbnail(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  dispose() {
    this.stopRecording();
    this.stopPlayAll();
    this.stopVideoRecord();
    this.exitLock();
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('keydown', this.onKeyBound);
    window.removeEventListener('keyup', this.onKeyBound);
    window.removeEventListener('resize', this.resize);
    this.renderer.dispose();
    this.controls.dispose();
  }

  // -------------------------------------------------------------------------
  // Build / rebuild
  // -------------------------------------------------------------------------

  private rebuildTerrain() {
    if (this.terrainMesh) {
      this.scene.remove(this.terrainMesh);
      this.terrainMesh.geometry.dispose();
      (this.terrainMesh.material as THREE.Material).dispose();
    }
    if (!this.sceneModel) return;
    const t = this.sceneModel.terrain;
    const side = terrainSide(t.segments);
    const positions = new Float32Array(side * side * 3);
    let p = 0;
    for (let j = 0; j < side; j++) {
      for (let i = 0; i < side; i++) {
        positions[p++] = -t.size / 2 + (i / t.segments) * t.size;
        positions[p++] = t.heights[j * side + i] ?? 0;
        positions[p++] = -t.size / 2 + (j / t.segments) * t.size;
      }
    }
    const indices: number[] = [];
    for (let j = 0; j < t.segments; j++) {
      for (let i = 0; i < t.segments; i++) {
        const a = j * side + i;
        const b = j * side + i + 1;
        const c = (j + 1) * side + i;
        const d = (j + 1) * side + i + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color: t.color, roughness: 0.95, metalness: 0 });
    this.terrainMesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.terrainMesh);
  }

  private rebuildWater() {
    if (this.waterMesh) {
      this.scene.remove(this.waterMesh);
      this.waterMesh.geometry.dispose();
      (this.waterMesh.material as THREE.Material).dispose();
    }
    if (!this.sceneModel) return;
    const geo = new THREE.PlaneGeometry(this.sceneModel.size, this.sceneModel.size);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: '#2f7fbf',
      transparent: true,
      opacity: 0.55,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.waterMesh = new THREE.Mesh(geo, mat);
    this.waterMesh.position.y = this.sceneModel.waterLevel;
    this.scene.add(this.waterMesh);
  }

  private rebuildWaterLocal() {
    if (this.waterLocalMesh) {
      this.scene.remove(this.waterLocalMesh);
      this.waterLocalMesh.geometry.dispose();
      (this.waterLocalMesh.material as THREE.Material).dispose();
      this.waterLocalMesh = null;
    }
    if (!this.sceneModel) return;
    const t = this.sceneModel.terrain;
    const side = terrainSide(t.segments);
    const positions = new Float32Array(side * side * 3);
    let p = 0;
    const y = (idx: number) => {
      const depth = t.water[idx] ?? 0;
      const terr = t.heights[idx] ?? 0;
      return depth > 0.001 ? terr + depth : terr - 0.02;
    };
    for (let j = 0; j < side; j++) {
      for (let i = 0; i < side; i++) {
        const idx = j * side + i;
        positions[p++] = -t.size / 2 + (i / t.segments) * t.size;
        positions[p++] = y(idx);
        positions[p++] = -t.size / 2 + (j / t.segments) * t.size;
      }
    }
    const indices: number[] = [];
    for (let j = 0; j < t.segments; j++) {
      for (let i = 0; i < t.segments; i++) {
        const a = j * side + i;
        const b = j * side + i + 1;
        const c = (j + 1) * side + i;
        const d = (j + 1) * side + i + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
      color: '#3a93d6',
      transparent: true,
      opacity: 0.6,
      roughness: 0.15,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    this.waterLocalMesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.waterLocalMesh);
  }

  private async rebuildObjects() {
    this.objectGroups.forEach((g) => this.objectsGroup.remove(g));
    this.objectGroups.clear();
    this.baseOffsetY.clear();
    if (!this.sceneModel) return;
    for (const obj of this.sceneModel.objects) await this.buildObject(obj);
    this.refreshSelection();
  }

  private async buildObject(obj: SceneObject) {
    const asset = this.assets.get(obj.assetId);
    if (!asset) return;
    const refs: RefMap = await resolveRefs(asset.root);
    const resolver: RefResolver = (id) => refs.get(id) ?? null;
    const group = buildPartObject(asset.root, resolver);
    group.userData.sceneObjId = obj.id;
    group.position.set(obj.position.x, obj.position.y, obj.position.z);
    group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
    group.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
    this.objectGroups.set(obj.id, group);
    this.objectsGroup.add(group);
    // Ground offset for ground mode = half the asset's bounding-box height.
    const box = new THREE.Box3().setFromObject(group);
    this.baseOffsetY.set(obj.id, box.isEmpty() ? 0 : (box.max.y - box.min.y) / 2);
  }

  // -------------------------------------------------------------------------
  // Input
  // -------------------------------------------------------------------------

  private async onCanvasClick() {
    if (this.recording) {
      // Re-acquire pointer lock if the user clicked while recording but the
      // lock was lost (without pressing Esc).
      if (!this.locked) await this.requestLock();
      return;
    }
    if (this.armedAssetId && this.terrainMesh) {
      const hit = this.raycastTerrain();
      if (hit) this.placeObjectAt(hit);
    }
  }

  private handlePick(ev: PointerEvent) {
    if (this.recording || this.armedAssetId) return;
    if (this.controls && (this.controls as unknown as { dragging?: boolean }).dragging) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, this.camera);
    const hits = ray.intersectObjects(this.objectsGroup.children, true);
    if (hits.length === 0) {
      this.setSelected(null);
      this.cb.onSelect?.(null);
      return;
    }
    let obj: THREE.Object3D | null = hits[0].object;
    while (obj && !obj.userData.sceneObjId) obj = obj.parent;
    const id = (obj?.userData.sceneObjId as string) ?? null;
    this.setSelected(id);
    this.cb.onSelect?.(id);
  }

  private placeObjectAt(point: THREE.Vector3) {
    if (!this.sceneModel || !this.armedAssetId) return;
    const asset = this.assets.get(this.armedAssetId);
    if (!asset) return;
    const obj: SceneObject = {
      id: `obj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      assetId: this.armedAssetId,
      name: asset.name,
      position: vec3(point.x, point.y, point.z),
      rotation: vec3(),
      scale: vec3(1, 1, 1),
    };
    this.sceneModel.objects.push(obj);
    void this.buildObject(obj).then(() => {
      this.armedAssetId = null;
      this.renderer.domElement.style.cursor = 'default';
      this.cb.onTracksChange?.();
      this.setSelected(obj.id);
      this.cb.onSelect?.(obj.id);
    });
  }

  private raycastTerrain(): THREE.Vector3 | null {
    if (!this.terrainMesh) return null;
    const el = this.renderer.domElement;
    // Use the last pointer position stored on the element (set in pointerdown).
    const rect = el.getBoundingClientRect();
    const last = (el as unknown as { __lastPointer?: { x: number; y: number } }).__lastPointer;
    if (!last) return null;
    const mouse = new THREE.Vector2(
      ((last.x - rect.left) / rect.width) * 2 - 1,
      -((last.y - rect.top) / rect.height) * 2 + 1,
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, this.camera);
    const hits = ray.intersectObject(this.terrainMesh, false);
    if (hits.length === 0) return null;
    return hits[0].point.clone();
  }

  private requestLock() {
    this.renderer.domElement.requestPointerLock?.();
  }

  private exitLock() {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  private onPointerLockChange = () => {
    const wasLocked = this.locked;
    this.locked = document.pointerLockElement === this.renderer.domElement;
    if (!this.locked && wasLocked) {
      // Esc released the lock. If armed, cancel; if recording, finish the track.
      if (this.recording) this.stopRecording();
      else if (this.cameraRecording) this.stopCameraRecording();
      else if (this.arming) this.cancelArming();
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.locked) return;
    this.yaw -= e.movementX * LOOK_SENSITIVITY;
    this.pitch -= e.movementY * LOOK_SENSITIVITY;
    this.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, this.pitch));
    if (this.cameraRecording) {
      this.applyCameraRotation();
    } else if (this.recording && this.recordObjectId) {
      const g = this.objectGroups.get(this.recordObjectId);
      if (g) g.rotation.y = this.yaw;
    }
  };

  private onKey = (e: KeyboardEvent, down: boolean) => {
    const k = e.key.toLowerCase();
    if (down && k === 'enter' && this.arming) {
      e.preventDefault();
      this.beginCapture();
      return;
    }
    if (['w', 'a', 's', 'd', ' ', 'shift'].includes(k)) {
      if (down) this.keys.add(k);
      else this.keys.delete(k);
      if (k === ' ') e.preventDefault();
    }
  };

  private onKeyBound = (e: KeyboardEvent) => this.onKey(e, e.type === 'keydown');

  private requestMic(stream: MediaStream): Promise<MediaStream> {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('mic timeout')), 1500));
    return Promise.race([
      navigator.mediaDevices.getUserMedia({ audio: true }).then((mic) => {
        mic.getAudioTracks().forEach((t) => stream.addTrack(t));
        return mic;
      }),
      timeout,
    ]);
  }

  // -------------------------------------------------------------------------
  // Movement / sampling / replay
  // -------------------------------------------------------------------------

  private moveRecordedObject(dt: number) {
    if (!this.recordObjectId) return;
    if (!this.recording && this.arming !== 'object') return;
    const g = this.objectGroups.get(this.recordObjectId);
    if (!g) return;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();
    if (this.keys.has('w')) move.add(forward);
    if (this.keys.has('s')) move.sub(forward);
    if (this.keys.has('d')) move.add(right);
    if (this.keys.has('a')) move.sub(right);
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(this.speed * dt);
    g.position.x += move.x;
    g.position.z += move.z;
    g.rotation.y = this.yaw;

    if (this.mode === 'ground') {
      const h = this.sceneModel
        ? sampleTerrainHeight(this.sceneModel.terrain, g.position.x, g.position.z)
        : 0;
      const off = this.baseOffsetY.get(this.recordObjectId) ?? 0;
      g.position.y = h + off;
    } else {
      let v = 0;
      if (this.keys.has(' ')) v += 1;
      if (this.keys.has('shift')) v -= 1;
      g.position.y += v * this.speed * dt;
    }
  }

  /** Capture the current object's transform into its track at the current time. */
  private sampleCurrent(force = false) {
    if (!this.recording || !this.recordObjectId) return;
    const g = this.objectGroups.get(this.recordObjectId);
    if (!g) return;
    const kfs = this.tracks.get(this.recordObjectId);
    if (!kfs) return;
    if (!force && this.recordT - this.recordLastSample < 1 / SAMPLE_HZ) return;
    this.recordLastSample = this.recordT;
    kfs.push({
      time: this.recordT,
      position: { x: g.position.x, y: g.position.y, z: g.position.z },
      rotation: { x: g.rotation.x, y: g.rotation.y, z: g.rotation.z },
      scale: { x: g.scale.x, y: g.scale.y, z: g.scale.z },
    });
  }

  /** Replay every OTHER recorded track at time `t` (used while recording). */
  private replayOtherTracks(t: number) {
    if (!this.recordObjectId) return;
    for (const [objId, kfs] of this.tracks) {
      if (objId === this.recordObjectId) continue;
      const g = this.objectGroups.get(objId);
      if (!g || kfs.length === 0) continue;
      const s = sampleRecorded(kfs, t);
      g.position.set(s.position.x, s.position.y, s.position.z);
      g.rotation.set(s.rotation.x, s.rotation.y, s.rotation.z);
      g.scale.set(s.scale.x, s.scale.y, s.scale.z);
    }
  }

  private applyObjectTracks(t: number) {
    for (const [objId, kfs] of this.tracks) {
      if (kfs.length === 0) continue;
      const g = this.objectGroups.get(objId);
      if (!g) continue;
      const s = sampleRecorded(kfs, t);
      g.position.set(s.position.x, s.position.y, s.position.z);
      g.rotation.set(s.rotation.x, s.rotation.y, s.rotation.z);
      g.scale.set(s.scale.x, s.scale.y, s.scale.z);
    }
  }

  private applySceneDefaults() {
    if (!this.sceneModel) return;
    for (const obj of this.sceneModel.objects) {
      const g = this.objectGroups.get(obj.id);
      if (g) {
        g.position.set(obj.position.x, obj.position.y, obj.position.z);
        g.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        g.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
      }
    }
  }

  private refreshSelection() {
    const selected = this.selectedId;
    this.objectGroups.forEach((g) => {
      g.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
        if (m && 'emissive' in m && (o as THREE.Mesh).isMesh) {
          let isSel = false;
          let cur: THREE.Object3D | null = o;
          while (cur) {
            if (cur.userData.sceneObjId === selected) {
              isSel = true;
              break;
            }
            cur = cur.parent;
          }
          m.emissive = new THREE.Color(isSel ? '#ffb300' : '#000000');
          m.emissiveIntensity = isSel ? 0.6 : 0;
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // Loop
  // -------------------------------------------------------------------------

  private resize = () => {
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 400;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  private animate = () => {
    requestAnimationFrame(this.animate);
    const dt = this.clock.getDelta();

    if (this.recording) {
      this.recordT += dt;
      this.moveRecordedObject(dt);
      this.sampleCurrent();
      this.replayOtherTracks(this.recordT);
    } else if (this.cameraRecording) {
      this.cameraRecordT += dt;
      this.moveCamera(dt);
      this.sampleCamera();
      this.replayOtherTracks(this.cameraRecordT);
    } else if (this.arming === 'object') {
      // Position the subject; no sampling yet. Keep other tracks moving.
      this.armT += dt;
      this.moveRecordedObject(dt);
      this.replayOtherTracks(this.armT);
    } else if (this.arming === 'camera') {
      this.armT += dt;
      this.moveCamera(dt);
      this.replayOtherTracks(this.armT);
    } else if (this.playing) {
      const dur = this.getDuration();
      this.playT += dt;
      if (dur > 0 && this.playT > dur) this.playT -= dur;
      this.applyFrame(this.playT);
    }

    if (this.controls.enabled) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}

/**
 * Sample a recorded track (array of {time, position, rotation, scale}) at time
 * `t`, linearly interpolating between surrounding samples. Unlike the keyframe
 * animation sampler, the recorded samples are already time-stamped captures, so
 * we interpolate raw transform values with flat extrapolation at the ends.
 */
function sampleRecorded(
  kfs: AnimKf[],
  t: number,
): { position: typeof kfs[number]['position']; rotation: typeof kfs[number]['rotation']; scale: typeof kfs[number]['scale'] } {
  if (kfs.length === 0) return { position: vec3(), rotation: vec3(), scale: vec3(1, 1, 1) };
  if (t <= kfs[0].time) {
    const k = kfs[0];
    return { position: { ...k.position }, rotation: { ...k.rotation }, scale: { ...k.scale } };
  }
  const last = kfs[kfs.length - 1];
  if (t >= last.time) {
    return { position: { ...last.position }, rotation: { ...last.rotation }, scale: { ...last.scale } };
  }
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (t >= a.time && t <= b.time) {
      const span = b.time - a.time || 1;
      const f = (t - a.time) / span;
      return {
        position: {
          x: a.position.x + (b.position.x - a.position.x) * f,
          y: a.position.y + (b.position.y - a.position.y) * f,
          z: a.position.z + (b.position.z - a.position.z) * f,
        },
        rotation: {
          x: a.rotation.x + (b.rotation.x - a.rotation.x) * f,
          y: a.rotation.y + (b.rotation.y - a.rotation.y) * f,
          z: a.rotation.z + (b.rotation.z - a.rotation.z) * f,
        },
        scale: {
          x: a.scale.x + (b.scale.x - a.scale.x) * f,
          y: a.scale.y + (b.scale.y - a.scale.y) * f,
          z: a.scale.z + (b.scale.z - a.scale.z) * f,
        },
      };
    }
  }
  const l = kfs[kfs.length - 1];
  return { position: { ...l.position }, rotation: { ...l.rotation }, scale: { ...l.scale } };
}
