import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import {
  type SceneComponent,
  type SceneObject,
  type TerrainData,
  type AssetComponent,
  groundOffsetY,
} from '@shape-craft/schema';
import type { TransformMode } from './three-view.ts';
import { buildPartObject, type RefResolver } from './scene-graph.ts';
import { resolveRefs, type RefMap } from './instance.ts';
import { sampleTerrainHeight, terrainSide, ensureTerrainWater, MAX_WATER_DEPTH } from '@shape-craft/schema';
import { createAxisRuler, createDimensionOverlay } from './ruler.ts';

export type SceneMode = 'terrain' | 'object';
export type TerrainTool = 'raise' | 'lower' | 'flatten' | 'water' | 'dry';

export interface SceneViewportCallbacks {
  /** A terrain vertex was edited (heights mutated in place). */
  onTerrainChange: () => void;
  /** An object was added. */
  onObjectAdd: (obj: SceneObject) => void;
  /** An object's transform changed (mutated in place). */
  onObjectChange: (obj: SceneObject) => void;
  /** Selection changed (object id or null). */
  onSelect: (id: string | null) => void;
}

/**
 * Self-contained 3D viewport for the scene editor. Owns a heightmap terrain,
 * a water plane and a set of placed asset instances, and supports two modes:
 *  - 'terrain': brush raise / lower / flatten + water level control.
 *  - 'object':  pick & place assets, select and transform them with a gizmo.
 */
export class SceneViewport {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private transform: TransformControls;
  private clock = new THREE.Clock();
  private frameCallbacks: Array<(dt: number) => void> = [];

  private cb: SceneViewportCallbacks;

  // Scene model (mutated in place)
  private sceneModel: SceneComponent | null = null;
  private assets = new Map<string, AssetComponent>();

  // 3D objects
  private terrainMesh: THREE.Mesh | null = null;
  private waterMesh: THREE.Mesh | null = null;
  private waterLocalMesh: THREE.Mesh | null = null;
  private objectsGroup = new THREE.Group();
  private objectGroups = new Map<string, THREE.Object3D>();
  private ruler: THREE.Group | null = null;
  private updateDimensions: (d: { x: number; y: number; z: number }) => void;

  // Mode / tool state
  private mode: SceneMode = 'terrain';
  private terrainTool: TerrainTool = 'raise';
  private brushSize = 3;
  private brushStrength = 0.6;
  private painting = false;
  private pointerDownPos = { x: 0, y: 0 };
  private downOnGizmo = false;

  // Object placement
  private armedAssetId: string | null = null;
  private selectedId: string | null = null;

  constructor(container: HTMLElement, cb: SceneViewportCallbacks) {
    this.container = container;
    this.cb = cb;

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
      this.downOnGizmo = (e as unknown as { value: boolean }).value;
      this.controls.enabled = !this.downOnGizmo;
    });
    this.transform.addEventListener('objectChange', () => this.emitObjectTransform());
    this.scene.add(this.transform.getHelper());

    this.scene.add(new THREE.HemisphereLight('#ffffff', '#3a3f4b', 1.0));
    const dir = new THREE.DirectionalLight('#ffffff', 1.5);
    dir.position.set(10, 18, 8);
    this.scene.add(dir);

    this.scene.add(this.objectsGroup);

    this.updateDimensions = createDimensionOverlay(container);

    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    dom.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('resize', () => this.resize());
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.container);
    this.resize();
    this.animate();
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** Load a scene model + the asset map used to resolve placed instances. */
  async setScene(scene: SceneComponent, assets: AssetComponent[]): Promise<void> {
    this.sceneModel = scene;
    this.assets = new Map(assets.map((a) => [a.id, a]));
    if (scene.terrain) ensureTerrainWater(scene.terrain);
    this.rebuildTerrain();
    this.rebuildWater();
    this.rebuildWaterLocal();
    this.rebuildObjects();
    this.applyMouseButtons();

    // Metric ruler sized to the region, so users can read how many meters the
    // world occupies along each axis.
    if (this.ruler) this.scene.remove(this.ruler);
    const s = scene.size;
    const step = Math.max(1, Math.round(s / 10));
    this.ruler = createAxisRuler(s, step);
    this.ruler.position.set(-s / 2, 0, -s / 2);
    this.scene.add(this.ruler);
    this.updateDimensions(this.getDimensions());

    // Frame the camera to the region size.
    this.camera.position.set(s * 0.75, s * 0.65, s * 0.75);
    this.controls.target.set(0, 0, 0);
  }

  setAssets(assets: AssetComponent[]) {
    this.assets = new Map(assets.map((a) => [a.id, a]));
    if (this.sceneModel) this.rebuildObjects();
  }

  setMode(mode: SceneMode) {
    this.mode = mode;
    this.armedAssetId = null;
    if (mode !== 'object') this.select(null);
    this.applyMouseButtons();
  }

  getMode(): SceneMode {
    return this.mode;
  }

  /**
   * Size of the placed content along each world axis, in meters (world units
   * are meters). Returns the bounding box of all placed objects, or the region
   * footprint when nothing is placed yet.
   */
  getDimensions(): { x: number; y: number; z: number } {
    const box = new THREE.Box3().setFromObject(this.objectsGroup);
    if (!box.isEmpty()) {
      const size = new THREE.Vector3();
      box.getSize(size);
      return { x: size.x, y: size.y, z: size.z };
    }
    const s = this.sceneModel?.size ?? 0;
    return { x: s, y: 0, z: s };
  }

  setTerrainTool(tool: TerrainTool) {
    this.terrainTool = tool;
  }

  setBrush(size: number, strength: number) {
    this.brushSize = size;
    this.brushStrength = strength;
  }

  setWaterLevel(level: number) {
    if (!this.sceneModel) return;
    this.sceneModel.waterLevel = level;
    if (this.waterMesh) this.waterMesh.position.y = level;
  }

  setTransformMode(mode: TransformMode) {
    this.transform.setMode(mode);
  }

  /** Arm an asset so the next click on the terrain places it. */
  armPlacement(assetId: string | null) {
    this.armedAssetId = assetId;
  }

  getArmed(): string | null {
    return this.armedAssetId;
  }

  /** Re-apply an object's model transform onto its live 3D group. */
  syncTransform(obj: SceneObject) {
    const g = this.objectGroups.get(obj.id);
    if (!g) return;
    g.position.set(obj.position.x, obj.position.y, obj.position.z);
    g.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
    g.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
  }

  select(id: string | null) {
    this.selectedId = id;
    this.refreshSelection();
    this.attachGizmo(id);
    this.cb.onSelect(id);
  }

  getSelectedId(): string | null {
    return this.selectedId;
  }

  deleteSelected() {
    if (!this.sceneModel || !this.selectedId) return;
    const id = this.selectedId;
    this.sceneModel.objects = this.sceneModel.objects.filter((o) => o.id !== id);
    const g = this.objectGroups.get(id);
    if (g) {
      this.objectsGroup.remove(g);
      this.objectGroups.delete(id);
    }
    this.select(null);
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
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('resize', this.resize);
  }

  onFrame(cb: (dt: number) => void): () => void {
    this.frameCallbacks.push(cb);
    return () => {
      this.frameCallbacks = this.frameCallbacks.filter((c) => c !== cb);
    };
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
      flatShading: false,
    });
    this.terrainMesh = new THREE.Mesh(geo, mat);
    this.terrainMesh.receiveShadow = true;
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

  /**
   * Build (or rebuild) the *local* water sheet — per-vertex water depth painted
   * onto the terrain. Unlike the global `waterLevel` plane, this follows the
   * carved terrain so it can form rivers / ponds in channels. Dry vertices are
   * buried just under the terrain so edge triangles stay hidden (no spikes).
   */
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

  /** Local water surface Y at a vertex (terrain + depth, or buried if dry). */
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


  private rebuildObjects() {
    this.objectGroups.forEach((g) => this.objectsGroup.remove(g));
    this.objectGroups.clear();
    if (!this.sceneModel) return;
    for (const obj of this.sceneModel.objects) this.buildObject(obj);
    this.updateDimensions(this.getDimensions());
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
    if (obj.id === this.selectedId) this.attachGizmo(obj.id);
  }

  // -------------------------------------------------------------------------
  // Pointer interaction
  // -------------------------------------------------------------------------

  private applyMouseButtons() {
    if (this.mode === 'terrain') {
      // Left paints terrain; orbit with right-drag.
      this.controls.mouseButtons = {
        LEFT: null as unknown as THREE.MOUSE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      };
    } else {
      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
    }
  }

  private raycastTerrain(ev: PointerEvent): THREE.Vector3 | null {
    if (!this.terrainMesh) return null;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, this.camera);
    const hits = ray.intersectObject(this.terrainMesh, false);
    return hits.length ? hits[0].point : null;
  }

  private onPointerDown(ev: PointerEvent) {
    if (this.mode === 'terrain' && ev.button === 0) {
      this.painting = true;
      this.paintAt(ev);
    }
    this.pointerDownPos = { x: ev.clientX, y: ev.clientY };
  }

  private onPointerMove(ev: PointerEvent) {
    if (this.painting && this.mode === 'terrain') this.paintAt(ev);
  }

  private onPointerUp(ev: PointerEvent) {
    const wasPainting = this.painting;
    this.painting = false;
    if (wasPainting) return;

    if (this.mode !== 'object') return;
    const moved =
      Math.abs(ev.clientX - this.pointerDownPos.x) + Math.abs(ev.clientY - this.pointerDownPos.y);
    if (moved > 5) return; // a drag → orbit, not a click
    if (this.downOnGizmo) return;

    if (this.armedAssetId) {
      const point = this.raycastTerrain(ev);
      if (point) this.placeArmed(point);
      return;
    }
    this.pickObject(ev);
  }

  private paintAt(ev: PointerEvent) {
    if (!this.sceneModel || !this.terrainMesh) return;
    const point = this.raycastTerrain(ev);
    if (!point) return;
    const t = this.sceneModel.terrain;
    const side = terrainSide(t.segments);
    const pos = this.terrainMesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    const heights = t.heights;
    const r = this.brushSize;
    const r2 = r * r;
    let changed = false;

    // Map world point to grid indices around it.
    const ci = Math.round(((point.x + t.size / 2) / t.size) * t.segments);
    const cj = Math.round(((point.z + t.size / 2) / t.size) * t.segments);
    const reach = Math.ceil(r / (t.size / t.segments)) + 1;

    for (let j = cj - reach; j <= cj + reach; j++) {
      for (let i = ci - reach; i <= ci + reach; i++) {
        if (i < 0 || j < 0 || i >= side || j >= side) continue;
        const wx = -t.size / 2 + (i / t.segments) * t.size;
        const wz = -t.size / 2 + (j / t.segments) * t.size;
        const dx = wx - point.x;
        const dz = wz - point.z;
        const d2 = dx * dx + dz * dz;
        if (d2 > r2) continue;
        const falloff = 1 - Math.sqrt(d2) / r; // 0..1
        const idx = j * side + i;
        if (this.terrainTool === 'water' || this.terrainTool === 'dry') {
          const cur = t.water[idx] ?? 0;
          const delta = this.brushStrength * falloff * 0.25;
          const next =
            this.terrainTool === 'water'
              ? Math.min(MAX_WATER_DEPTH, cur + delta)
              : Math.max(0, cur - delta);
          if (next !== cur) {
            t.water[idx] = next;
            changed = true;
          }
        } else {
          const cur = heights[idx];
          let next = cur;
          if (this.terrainTool === 'raise') next = cur + this.brushStrength * falloff;
          else if (this.terrainTool === 'lower') next = cur - this.brushStrength * falloff;
          else next = cur + (point.y - cur) * Math.min(1, falloff);
          heights[idx] = next;
          pos.setY(idx, next);
          changed = true;
        }
      }
    }
    if (changed) {
      if (this.terrainTool === 'water' || this.terrainTool === 'dry') {
        this.refreshWaterLocal();
      } else {
        pos.needsUpdate = true;
        this.terrainMesh.geometry.computeVertexNormals();
        this.refreshWaterLocal();
      }
      this.cb.onTerrainChange();
    }
  }

  /** Recompute the local water sheet's vertex heights in place. */
  private refreshWaterLocal() {
    if (!this.waterLocalMesh || !this.sceneModel) return;
    const t = this.sceneModel.terrain;
    const side = terrainSide(t.segments);
    const pos = this.waterLocalMesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let idx = 0; idx < side * side; idx++) {
      pos.setY(idx, this.waterLocalY(t, idx));
    }
    pos.needsUpdate = true;
    this.waterLocalMesh.geometry.computeVertexNormals();
  }

  private async placeArmed(point: THREE.Vector3) {
    const assetId = this.armedAssetId!;
    const asset = this.assets.get(assetId);
    this.armedAssetId = null;
    if (!asset || !this.sceneModel) return;
    const ground = sampleTerrainHeight(this.sceneModel.terrain, point.x, point.z);
    const obj = {
      id: `obj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      assetId,
      name: asset.name,
      position: {
        x: point.x,
        y: ground,
        z: point.z,
      },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    } as SceneObject;
    // Lift so the asset rests on the ground (assets are centered at origin).
    obj.position.y = ground + groundOffsetY(asset.root);
    this.sceneModel.objects.push(obj);
    await this.buildObject(obj);
    this.cb.onObjectAdd(obj);
    this.select(obj.id);
  }

  private pickObject(ev: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, this.camera);
    const hits = ray.intersectObjects(this.objectsGroup.children, true);
    if (hits.length === 0) {
      this.select(null);
      return;
    }
    let obj: THREE.Object3D | null = hits[0].object;
    while (obj && !obj.userData.sceneObjId) obj = obj.parent;
    this.select((obj?.userData.sceneObjId as string) ?? null);
  }

  // -------------------------------------------------------------------------
  // Selection / gizmo
  // -------------------------------------------------------------------------

  private findObjectGroup(id: string): THREE.Object3D | null {
    return this.objectGroups.get(id) ?? null;
  }

  private attachGizmo(id: string | null) {
    if (!id || this.mode !== 'object') {
      this.transform.detach();
      return;
    }
    const g = this.findObjectGroup(id);
    if (g) this.transform.attach(g);
    else this.transform.detach();
  }

  private emitObjectTransform() {
    const id = this.selectedId;
    if (!id || !this.sceneModel) return;
    const g = this.objectGroups.get(id);
    const obj = this.sceneModel.objects.find((o) => o.id === id);
    if (!g || !obj) return;
    obj.position = { x: g.position.x, y: g.position.y, z: g.position.z };
    obj.rotation = { x: g.rotation.x, y: g.rotation.y, z: g.rotation.z };
    obj.scale = { x: g.scale.x, y: g.scale.y, z: g.scale.z };
    this.cb.onObjectChange(obj);
  }

  private refreshSelection() {
    const sel = this.selectedId;
    this.objectsGroup.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m && (m as THREE.MeshStandardMaterial).isMeshStandardMaterial && 'emissive' in m) {
        let isSel = false;
        let cur: THREE.Object3D | null = o;
        while (cur) {
          if (cur.userData.sceneObjId === sel) {
            isSel = true;
            break;
          }
          cur = cur.parent;
        }
        (m as THREE.MeshStandardMaterial).emissive = new THREE.Color(isSel ? '#ffb300' : '#000000');
        (m as THREE.MeshStandardMaterial).emissiveIntensity = isSel ? 0.5 : 0;
      }
    });
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
    for (const cb of this.frameCallbacks) cb(dt);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
