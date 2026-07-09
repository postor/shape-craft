import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import {
  type SceneComponent,
  type SceneObject,
  type AssetComponent,
  type AnimComponent,
  type AnimChannel,
  type AnimState,
  sampleTrack,
} from '../schema';
import { TransformMode } from './three-view.ts';
import { buildPartObject, type RefResolver } from './scene-graph.ts';
import { resolveRefs, type RefMap } from './instance.ts';
import { terrainSide, ensureTerrainWater } from '../schema';
import { CharacterAnimator } from './character-anim.ts';
import { CHARACTER_CLIPS, type CharacterType } from '../schema';

/** Map a segment state to the character clip name that drives it. */
function stateToClip(state: AnimState): string | null {
  switch (state) {
    case 'walk':
      return 'walk';
    case 'fly':
      return 'fly';
    case 'idle':
      return 'idle';
    case 'sit':
      return 'sit';
    default:
      return null;
  }
}

/**
 * Viewport for authoring + previewing a SceneCraft animation.
 *
 * It renders the chosen scene (terrain + placed assets) exactly like the scene
 * editor, then drives two always-present tracks — `camera` and `cameraTarget` —
 * plus any user-added `object` tracks. Each frame it samples every track at the
 * current time and:
 *   - positions the viewer camera + its orbit pivot from the camera tracks,
 *   - moves / rotates / scales the bound object from its object track,
 *   - plays the matching character clip (walk / fly / idle / sit) for the
 *     segment's `state`, so a character actually walks or flies between
 *     keyframes.
 *
 * In edit mode (paused) the gizmo attaches to the selected object track's object
 * so the user can pose it; "record" writes that pose into a keyframe.
 */
export class AnimationViewport {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private transform: TransformControls;
  private clock = new THREE.Clock();

  private sceneModel: SceneComponent | null = null;
  private assets = new Map<string, AssetComponent>();
  private anim: AnimComponent | null = null;

  private terrainMesh: THREE.Mesh | null = null;
  private waterMesh: THREE.Mesh | null = null;
  private waterLocalMesh: THREE.Mesh | null = null;
  private objectsGroup = new THREE.Group();
  private objectGroups = new Map<string, THREE.Object3D>();
  private charAnimators = new Map<string, CharacterAnimator>();
  private charState = new Map<string, AnimState>();
  private markersGroup = new THREE.Group();
  private targetMarker: THREE.Mesh | null = null;

  private playing = false;
  private time = 0;
  private speed = 1;
  private duration = 8;

  private selectedTrackId: string | null = null;
  private draggingGizmo = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene.background = new THREE.Color('#10131a');

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
    this.camera.position.set(18, 16, 18);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);
    this.controls.maxPolarAngle = Math.PI / 2.05;

    this.transform = new TransformControls(this.camera, this.renderer.domElement);
    this.transform.setSize(0.9);
    this.transform.addEventListener('dragging-changed', (e) => {
      this.draggingGizmo = (e as unknown as { value: boolean }).value;
      this.controls.enabled = !this.draggingGizmo;
    });
    this.transform.addEventListener('objectChange', () => {
      if (this.selectedTrackId) this.onGizmoChange();
    });
    this.transform.addEventListener('mouseUp', () => {
      if (this.selectedTrackId) this.onGizmoChange(true);
    });
    this.scene.add(this.transform.getHelper());

    this.scene.add(new THREE.HemisphereLight('#ffffff', '#3a3f4b', 1.0));
    const dir = new THREE.DirectionalLight('#ffffff', 1.5);
    dir.position.set(10, 18, 8);
    this.scene.add(dir);

    this.scene.add(this.objectsGroup);
    this.scene.add(this.markersGroup);

    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', () => this.applyMouseButtons());
    window.addEventListener('resize', () => this.resize());
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.container);
    this.resize();
    this.animate();
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  async setScene(scene: SceneComponent, assets: AssetComponent[]): Promise<void> {
    this.sceneModel = scene;
    this.assets = new Map(assets.map((a) => [a.id, a]));
    if (scene.terrain) ensureTerrainWater(scene.terrain);
    this.rebuildTerrain();
    this.rebuildWater();
    this.rebuildWaterLocal();
    this.rebuildObjects();
    this.camera.position.set(scene.size * 0.75, scene.size * 0.65, scene.size * 0.75);
    this.controls.target.set(0, 0, 0);
  }

  setAnimation(anim: AnimComponent) {
    this.anim = anim;
    this.duration = anim.duration;
    this.time = 0;
    this.rebuildMarkers();
    this.applyCameraPose();
    this.applyObjectPoses();
  }

  /** Re-read the (mutated) animation and re-render markers + poses. */
  refresh() {
    if (!this.anim) return;
    this.duration = this.anim.duration;
    this.rebuildMarkers();
    this.applyCameraPose();
    if (!this.playing) this.applyObjectPoses();
    if (this.selectedTrackId) this.selectTrack(this.selectedTrackId);
  }

  setTime(t: number) {
    this.time = Math.max(0, Math.min(this.duration, t));
    this.applyCameraPose();
    this.applyObjectPoses();
    this.rebuildMarkers();
  }

  getTime(): number {
    return this.time;
  }

  getDuration(): number {
    return this.duration;
  }

  setPlaying(p: boolean) {
    this.playing = p;
    if (p) this.transform.detach();
  }

  isPlaying(): boolean {
    return this.playing;
  }

  setSpeed(s: number) {
    this.speed = Math.max(0.05, s);
  }

  setTransformMode(mode: TransformMode) {
    this.transform.setMode(mode);
  }

  /** Select an object track so its object can be posed with the gizmo. */
  selectTrack(trackId: string | null) {
    this.selectedTrackId = trackId;
    if (!trackId || this.playing) {
      this.transform.detach();
      return;
    }
    const track = this.findTrack(trackId);
    if (track?.kind === 'object' && track.objectId) {
      const g = this.objectGroups.get(track.objectId);
      if (g) this.transform.attach(g);
      else this.transform.detach();
    } else {
      this.transform.detach();
    }
  }

  /** Capture the current viewer camera + its orbit target as keyframes. */
  recordCamera() {
    if (!this.anim) return;
    const cam = this.findTrackByKind('camera');
    const tgt = this.findTrackByKind('cameraTarget');
    if (cam) this.writeKeyframe(cam, this.time, this.camera.position, undefined, undefined);
    if (tgt) this.writeKeyframe(tgt, this.time, this.controls.target, undefined, undefined);
    this.rebuildMarkers();
  }

  /** Record the selected object track's current gizmo pose as a keyframe. */
  recordSelectedObject() {
    if (!this.anim || !this.selectedTrackId) return;
    const track = this.findTrack(this.selectedTrackId);
    if (!track || track.kind !== 'object' || !track.objectId) return;
    const g = this.objectGroups.get(track.objectId);
    if (!g) return;
    this.writeKeyframe(
      track,
      this.time,
      { x: g.position.x, y: g.position.y, z: g.position.z },
      { x: g.rotation.x, y: g.rotation.y, z: g.rotation.z },
      { x: g.scale.x, y: g.scale.y, z: g.scale.z },
    );
    this.rebuildMarkers();
  }

  /** Read the currently selected object's live transform (for the inspector). */
  getSelectedObject(): SceneObject | null {
    const track = this.selectedTrackId ? this.findTrack(this.selectedTrackId) : null;
    if (!track || track.kind !== 'object' || !track.objectId || !this.sceneModel) return null;
    return this.sceneModel.objects.find((o) => o.id === track.objectId) ?? null;
  }

  setSelectedObjectTransform(obj: SceneObject) {
    const g = obj && this.objectGroups.get(obj.id);
    if (g) {
      g.position.set(obj.position.x, obj.position.y, obj.position.z);
      g.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
      g.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
    }
  }

  syncObjectTransform(obj: SceneObject) {
    const g = this.objectGroups.get(obj.id);
    if (g) {
      obj.position = { x: g.position.x, y: g.position.y, z: g.position.z };
      obj.rotation = { x: g.rotation.x, y: g.rotation.y, z: g.rotation.z };
      obj.scale = { x: g.scale.x, y: g.scale.y, z: g.scale.z };
    }
  }

  captureThumbnail(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  dispose() {
    this.renderer.dispose();
    this.controls.dispose();
    this.transform.detach();
    this.transform.dispose();
    window.removeEventListener('resize', this.resize);
  }

  // ---------------------------------------------------------------------------
  // Build / rebuild
  // ---------------------------------------------------------------------------

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
    const mat = new THREE.MeshStandardMaterial({
      color: t.color,
      roughness: 0.95,
      metalness: 0.0,
      flatShading: false,
    });
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

  private rebuildObjects() {
    this.objectGroups.forEach((g) => this.objectsGroup.remove(g));
    this.objectGroups.clear();
    this.charAnimators.clear();
    this.charState.clear();
    if (!this.sceneModel) return;
    for (const obj of this.sceneModel.objects) void this.buildObject(obj);
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

    // If this is a character asset, wire up a per-bone animator so states
    // (walk / fly / idle / sit) drive its skeleton.
    if (asset.characterType) {
      const clips = CHARACTER_CLIPS[asset.characterType as CharacterType] ?? [];
      const animator = new CharacterAnimator(group);
      animator.setClips(clips);
      animator.rebind(group);
      this.charAnimators.set(obj.id, animator);
    }

    if (this.selectedTrackId) this.selectTrack(this.selectedTrackId);
  }

  // ---------------------------------------------------------------------------
  // Pose application
  // ---------------------------------------------------------------------------

  private applyCameraPose() {
    if (!this.anim) return;
    const cam = this.findTrackByKind('camera');
    const tgt = this.findTrackByKind('cameraTarget');
    if (cam) {
      const s = sampleTrack(cam, this.time);
      this.camera.position.set(s.position.x, s.position.y, s.position.z);
    }
    if (tgt) {
      const s = sampleTrack(tgt, this.time);
      this.controls.target.set(s.position.x, s.position.y, s.position.z);
    }
    this.controls.update();
    // Keep a small marker where the camera looks.
    if (!this.targetMarker) {
      this.targetMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 12, 12),
        new THREE.MeshBasicMaterial({ color: '#ffb300', wireframe: true }),
      );
      this.scene.add(this.targetMarker);
    }
    this.targetMarker.position.copy(this.controls.target);
  }

  /** Apply every object track's sampled pose to its live 3D group. */
  private applyObjectPoses() {
    if (!this.anim || !this.sceneModel) return;
    for (const track of this.anim.tracks) {
      if (track.kind !== 'object' || !track.objectId) continue;
      const g = this.objectGroups.get(track.objectId);
      if (!g) continue;
      const s = sampleTrack(track, this.time);
      g.position.set(s.position.x, s.position.y, s.position.z);
      g.rotation.set(s.rotation.x, s.rotation.y, s.rotation.z);
      g.scale.set(s.scale.x, s.scale.y, s.scale.z);
      // Drive the character skeleton if this object is a character.
      const animator = this.charAnimators.get(track.objectId);
      if (animator) {
        const clip = stateToClip(s.state);
        this.charState.set(track.objectId, s.state);
        if (clip && animator.getClipNames().includes(clip)) animator.play(clip, false);
        else animator.applyRest();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Keyframe helpers
  // ---------------------------------------------------------------------------

  private findTrack(id: string): AnimChannel | null {
    return this.anim?.tracks.find((t) => t.id === id) ?? null;
  }
  private findTrackByKind(kind: AnimChannel['kind']): AnimChannel | null {
    return this.anim?.tracks.find((t) => t.kind === kind) ?? null;
  }

  /** Insert or update the keyframe at `time` on `track` with a pose. */
  private writeKeyframe(
    track: AnimChannel,
    time: number,
    position: { x: number; y: number; z: number },
    rotation?: { x: number; y: number; z: number },
    scale?: { x: number; y: number; z: number },
  ) {
    const kf = track.keyframes.find((k) => Math.abs(k.time - time) < 1e-3);
    if (kf) {
      kf.position = { ...position };
      if (rotation) kf.rotation = { ...rotation };
      if (scale) kf.scale = { ...scale };
    } else {
      track.keyframes.push({
        time,
        position: { ...position },
        rotation: rotation ?? { x: 0, y: 0, z: 0 },
        scale: scale ?? { x: 1, y: 1, z: 1 },
      });
      track.keyframes.sort((a, b) => a.time - b.time);
    }
  }

  /** Called while/after the user drags the gizmo on an object track. */
  private onGizmoChange(ended = false) {
    if (!this.anim || !this.selectedTrackId) return;
    const track = this.findTrack(this.selectedTrackId);
    if (!track || track.kind !== 'object' || !track.objectId) return;
    const g = this.objectGroups.get(track.objectId);
    if (!g) return;
    const pos = { x: g.position.x, y: g.position.y, z: g.position.z };
    const rot = { x: g.rotation.x, y: g.rotation.y, z: g.rotation.z };
    const scl = { x: g.scale.x, y: g.scale.y, z: g.scale.z };
    if (ended) {
      this.writeKeyframe(track, this.time, pos, rot, scl);
      this.rebuildMarkers();
    } else {
      // Live-update the keyframe at the current time (create one if needed).
      this.writeKeyframe(track, this.time, pos, rot, scl);
    }
    // Mirror into the scene model so saving stays consistent.
    if (this.sceneModel) {
      const obj = this.sceneModel.objects.find((o) => o.id === track.objectId);
      if (obj) {
        obj.position = pos;
        obj.rotation = rot;
        obj.scale = scl;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Markers (keyframe dots + paths) for camera / target tracks
  // ---------------------------------------------------------------------------

  private rebuildMarkers() {
    if (!this.anim) return;
    this.markersGroup.clear();
    const cam = this.findTrackByKind('camera');
    const tgt = this.findTrackByKind('cameraTarget');
    if (cam) this.addTrackMarkers(cam, '#5fd0ff', true);
    if (tgt) this.addTrackMarkers(tgt, '#ffb300', false);
  }

  private addTrackMarkers(track: AnimChannel, color: string, cone: boolean) {
    const kfs = [...track.keyframes].sort((a, b) => a.time - b.time);
    const pts: THREE.Vector3[] = [];
    for (const kf of kfs) {
      const m = new THREE.Mesh(
        cone
          ? new THREE.ConeGeometry(0.35, 0.9, 10)
          : new THREE.SphereGeometry(0.35, 10, 10),
        new THREE.MeshBasicMaterial({ color }),
      );
      m.position.set(kf.position.x, kf.position.y, kf.position.z);
      this.markersGroup.add(m);
      pts.push(new THREE.Vector3(kf.position.x, kf.position.y, kf.position.z));
    }
    if (pts.length >= 2) {
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 }));
      this.markersGroup.add(line);
    }
  }

  // ---------------------------------------------------------------------------
  // Mouse buttons + loop
  // ---------------------------------------------------------------------------

  private applyMouseButtons() {
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
  }

  private resize = () => {
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 400;
    this.renderer.setSize(w, h);
    const el = this.renderer.domElement;
    el.style.display = 'block';
    el.style.width = '100%';
    el.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  private animate = () => {
    requestAnimationFrame(this.animate);
    const dt = this.clock.getDelta();
    if (this.playing && this.anim) {
      this.time += dt * this.speed;
      if (this.time > this.duration) this.time -= this.duration;
      this.applyCameraPose();
      this.applyObjectPoses();
      this.onTimeTick?.(this.time);
    }
    // Advance every character skeleton according to its current segment state
    // (works while playing, and keeps characters alive in edit mode too).
    this.charAnimators.forEach((animator, objId) => {
      const state = this.charState.get(objId) ?? 'none';
      const clip = stateToClip(state);
      if (clip && animator.getClipNames().includes(clip)) animator.update(dt * this.speed);
    });
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  /** Optional hook so the editor UI can follow playback time. */
  onTimeTick?: (t: number) => void;
}
