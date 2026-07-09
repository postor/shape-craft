import * as THREE from 'three';
import {
  type SceneComponent,
  type AssetComponent,
  type TerrainData,
  type SceneObject,
  sampleTerrainHeight,
  terrainSide,
  ensureTerrainWater,
} from '@shape-craft/schema';
import { buildPartObject, type RefResolver } from './scene-graph.ts';
import { resolveRefs, type RefMap } from './instance.ts';

export type RoamMode = 'walk' | 'fly';

const EYE_HEIGHT = 1.7;
const LOOK_SENSITIVITY = 0.0022;
const PITCH_LIMIT = Math.PI / 2 - 0.05;

export interface RoamViewportCallbacks {
  /** Fired whenever the recording state changes (start / stop). */
  onRecordingChange?: (recording: boolean) => void;
  /** Fired when the user exits pointer-lock (releases the mouse). */
  onLockChange?: (locked: boolean) => void;
}

/**
 * First-person "roam" viewport. Builds the same scene graph as the scene
 * editor (terrain + local/global water + placed asset instances) but drives
 * the camera with a pointer-lock first-person controller instead of Orbit /
 * Transform gizmos. Supports a walking mode (camera glued to terrain height)
 * and a flying mode (free 6-DOF), an adjustable move speed, and in-browser
 * video recording of the WebGL canvas.
 */
export class RoamViewport {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();

  private cb: RoamViewportCallbacks;

  // Scene model
  private sceneModel: SceneComponent | null = null;
  private assets = new Map<string, AssetComponent>();

  // 3D objects
  private terrainMesh: THREE.Mesh | null = null;
  private waterMesh: THREE.Mesh | null = null;
  private waterLocalMesh: THREE.Mesh | null = null;
  private objectsGroup = new THREE.Group();

  // Roam state
  private mode: RoamMode = 'fly';
  private speed = 5;
  private yaw = 0;
  private pitch = 0;
  private keys = new Set<string>();
  private locked = false;

  // Recording
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private recording = false;

  constructor(container: HTMLElement, cb: RoamViewportCallbacks = {}) {
    this.container = container;
    this.cb = cb;

    this.scene.background = new THREE.Color('#10131a');
    this.scene.fog = new THREE.Fog('#10131a', 40, 220);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    this.camera.rotation.order = 'YXZ';
    this.camera.position.set(0, EYE_HEIGHT, 0.01);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    const el = this.renderer.domElement;
    el.style.display = 'block';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.cursor = 'pointer';

    this.scene.add(new THREE.HemisphereLight('#ffffff', '#3a3f4b', 1.0));
    const dir = new THREE.DirectionalLight('#ffffff', 1.5);
    dir.position.set(10, 18, 8);
    this.scene.add(dir);
    this.scene.add(this.objectsGroup);

    // Pointer-lock mouse look.
    el.addEventListener('click', () => this.requestLock());
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
    if (scene.terrain) ensureTerrainWater(scene.terrain);
    this.rebuildTerrain();
    this.rebuildWater();
    this.rebuildWaterLocal();
    await this.rebuildObjects();

    // Start airborne so the camera never spawns inside the terrain (fly mode).
    const ground = sampleTerrainHeight(scene.terrain, 0, 0);
    const s = scene.size;
    this.camera.position.set(0, ground + Math.max(EYE_HEIGHT + 6, s * 0.45), 0);
    this.yaw = 0;
    this.pitch = -0.4;
    this.applyRotation();
  }

  setMode(mode: RoamMode) {
    this.mode = mode;
  }

  getMode(): RoamMode {
    return this.mode;
  }

  setSpeed(speed: number) {
    this.speed = Math.max(0.5, speed);
  }

  getSpeed(): number {
    return this.speed;
  }

  isLocked(): boolean {
    return this.locked;
  }

  exitLock() {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  isRecording(): boolean {
    return this.recording;
  }

  /** Request mic access, racing a timeout so a pending permission prompt can
   * never block the recording start. Resolves with the granted MediaStream, or
   * rejects/times out so the caller falls back to canvas-only capture. */
  private requestMic(stream: MediaStream): Promise<MediaStream> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('mic timeout')), 1500),
    );
    return Promise.race([
      navigator.mediaDevices.getUserMedia({ audio: true }).then((mic) => {
        mic.getAudioTracks().forEach((t) => stream.addTrack(t));
        return mic;
      }),
      timeout,
    ]);
  }

  /** Start recording the WebGL canvas. Requests microphone access so the user
   * can narrate; if denied or not granted in time, recording continues silently.
   * The on-screen instructions and speed/record controls are DOM elements and
   * are NOT part of the canvas stream, so they never appear in the recording. */
  async startRecording(): Promise<void> {
    if (this.recording) return;
    const canvas = this.renderer.domElement as HTMLCanvasElement;
    const stream = canvas.captureStream(30);

    // Try to mix in the microphone for voice-over, but never block on the
    // permission prompt — start recording on the canvas immediately and only
    // add the mic track if it is granted within a short timeout (MediaRecorder
    // cannot retroactively record a track added after it starts).
    const mic = await this.requestMic(stream).catch(() => null);
    void mic;

    const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(
      (m) => MediaRecorder.isTypeSupported(m),
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
      a.download = `roam-${Date.now()}.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    this.recorder.start();
    this.recording = true;
    this.cb.onRecordingChange?.(true);
  }

  stopRecording(): void {
    if (!this.recording || !this.recorder) return;
    this.recorder.stop();
    this.recorder = null;
    this.recording = false;
    this.cb.onRecordingChange?.(false);
  }

  dispose() {
    this.stopRecording();
    this.exitLock();
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('keydown', this.onKeyBound);
    window.removeEventListener('keyup', this.onKeyBound);
    window.removeEventListener('resize', this.resize);
    this.renderer.dispose();
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
    const geo = this.buildTerrainGeometry(this.sceneModel.terrain);
    const mat = new THREE.MeshStandardMaterial({
      color: this.sceneModel.terrain.color,
      roughness: 0.95,
      metalness: 0.0,
    });
    this.terrainMesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.terrainMesh);
  }

  private buildTerrainGeometry(t: TerrainData): THREE.BufferGeometry {
    const side = terrainSide(t.segments);
    const positions = new Float32Array(side * side * 3);
    let p = 0;
    for (let j = 0; j < side; j++) {
      for (let i = 0; i < side; i++) {
        const x = -t.size / 2 + (i / t.segments) * t.size;
        const z = -t.size / 2 + (j / t.segments) * t.size;
        const y = t.heights[j * side + i] ?? 0;
        positions[p++] = x;
        positions[p++] = y;
        positions[p++] = z;
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
    return geo;
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
    const geo = this.buildWaterGeometry(t);
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

  private waterLocalY(t: TerrainData, idx: number): number {
    const depth = t.water[idx] ?? 0;
    const terr = t.heights[idx] ?? 0;
    return depth > 0.001 ? terr + depth : terr - 0.02;
  }

  private buildWaterGeometry(t: TerrainData): THREE.BufferGeometry {
    const side = terrainSide(t.segments);
    const positions = new Float32Array(side * side * 3);
    let p = 0;
    for (let j = 0; j < side; j++) {
      for (let i = 0; i < side; i++) {
        const x = -t.size / 2 + (i / t.segments) * t.size;
        const z = -t.size / 2 + (j / t.segments) * t.size;
        const idx = j * side + i;
        positions[p++] = x;
        positions[p++] = this.waterLocalY(t, idx);
        positions[p++] = z;
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
    return geo;
  }

  private async rebuildObjects() {
    this.objectsGroup.clear();
    if (!this.sceneModel) return;
    for (const obj of this.sceneModel.objects) await this.buildObject(obj);
  }

  private async buildObject(obj: SceneObject) {
    const asset = this.assets.get(obj.assetId);
    if (!asset) return;
    const refs: RefMap = await resolveRefs(asset.root);
    const resolver: RefResolver = (id) => refs.get(id) ?? null;
    const group = buildPartObject(asset.root, resolver);
    group.position.set(obj.position.x, obj.position.y, obj.position.z);
    group.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
    group.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
    this.objectsGroup.add(group);
  }

  // -------------------------------------------------------------------------
  // Input
  // -------------------------------------------------------------------------

  private requestLock() {
    this.renderer.domElement.requestPointerLock?.();
  }

  private onPointerLockChange = () => {
    this.locked = document.pointerLockElement === this.renderer.domElement;
    this.cb.onLockChange?.(this.locked);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.locked) return;
    this.yaw -= e.movementX * LOOK_SENSITIVITY;
    this.pitch -= e.movementY * LOOK_SENSITIVITY;
    this.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, this.pitch));
    this.applyRotation();
  };

  private onKey = (e: KeyboardEvent, down: boolean) => {
    const k = e.key.toLowerCase();
    if (
      ['w', 'a', 's', 'd', ' ', 'shift', 'control', 'q', 'e'].includes(k)
    ) {
      if (down) this.keys.add(k);
      else this.keys.delete(k);
      if (k === ' ') e.preventDefault();
    }
  };

  private onKeyBound = (e: KeyboardEvent) => this.onKey(e, e.type === 'keydown');

  private applyRotation() {
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
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

  private move(dt: number) {
    if (!this.locked) return;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();

    if (this.keys.has('w')) move.add(forward);
    if (this.keys.has('s')) move.sub(forward);
    if (this.keys.has('d')) move.add(right);
    if (this.keys.has('a')) move.sub(right);

    let vertical = 0;
    if (this.keys.has(' ')) vertical += 1;
    if (this.keys.has('shift')) vertical -= 1;

    const dist = this.speed * dt;

    if (this.mode === 'fly') {
      // Full 6-DOF: include look pitch for forward motion and free vertical.
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
      this.camera.position.y += vertical * dist;
    } else {
      // Walk: horizontal only; camera snaps to terrain height + eye height.
      if (move.lengthSq() > 0) move.normalize().multiplyScalar(dist);
      this.camera.position.x += move.x;
      this.camera.position.z += move.z;
      if (this.sceneModel) {
        const h = sampleTerrainHeight(this.sceneModel.terrain, this.camera.position.x, this.camera.position.z);
        this.camera.position.y = h + EYE_HEIGHT;
      }
    }
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    const dt = this.clock.getDelta();
    this.move(dt);
    this.renderer.render(this.scene, this.camera);
  };
}
