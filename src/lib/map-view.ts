import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { AssetComponent, MapComponent } from '../schema';
import { buildPartObject } from './scene-graph.ts';

export type MapEditMode = 'roam' | 'raise' | 'lower' | 'flatten' | 'place' | 'select';

export interface MapViewportOptions {
  onSelectInstance: (id: string | null) => void;
  onPlace: (point: { x: number; y: number; z: number }) => void;
  /** called whenever terrain heights / instances are mutated, so the editor can persist */
  onChange: () => void;
}

/**
 * A Three.js viewport for editing a square-area map: a displaced terrain grid,
 * a toggleable water plane, and placed asset instances. Supports OrbitControls
 * roaming plus terrain sculpt (raise/lower/flatten) and instance place/select.
 */
export class MapViewport {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private terrainMesh: THREE.Mesh;
  private waterMesh: THREE.Mesh;
  private instanceGroup = new THREE.Group();
  private grid: THREE.GridHelper;
  private onSelectInstance: (id: string | null) => void;
  private onPlace: (point: { x: number; y: number; z: number }) => void;
  private onChange: () => void;

  private map: MapComponent;
  private assets = new Map<string, AssetComponent>();
  private mode: MapEditMode = 'roam';
  private placeAssetId: string | null = null;
  private selectedInstanceId: string | null = null;
  private painting = false;

  private readonly brushRadius = 2.2;
  private readonly brushStrength = 0.45;

  constructor(container: HTMLElement, map: MapComponent, opts: MapViewportOptions) {
    this.container = container;
    this.map = map;
    this.onSelectInstance = opts.onSelectInstance;
    this.onPlace = opts.onPlace;
    this.onChange = opts.onChange;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1b1d23');

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(this.map.size * 0.7, this.map.size * 0.7, this.map.size * 0.7);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);

    const hemi = new THREE.HemisphereLight('#ffffff', '#444455', 1.1);
    this.scene.add(hemi);
    const dir = new THREE.DirectionalLight('#ffffff', 1.4);
    dir.position.set(6, 10, 5);
    this.scene.add(dir);

    this.grid = new THREE.GridHelper(this.map.size, 10, '#3a3d47', '#2a2c33');
    this.scene.add(this.grid);

    const terrainMat = new THREE.MeshStandardMaterial({ color: '#5b8c4a', roughness: 0.95, metalness: 0.0, flatShading: false });
    this.terrainMesh = new THREE.Mesh(this.buildTerrainGeometry(), terrainMat);
    this.scene.add(this.terrainMesh);

    const waterMat = new THREE.MeshStandardMaterial({
      color: this.map.water.color,
      transparent: true,
      opacity: 0.6,
      roughness: 0.2,
      metalness: 0.1,
    });
    this.waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(this.map.size, this.map.size), waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.y = this.map.water.level;
    this.waterMesh.visible = this.map.water.enabled;
    this.scene.add(this.waterMesh);

    this.scene.add(this.instanceGroup);
    this.buildInstances();

    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('resize', () => this.resize());
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.container);
    this.resize();
    this.animate();
  }

  private buildTerrainGeometry(): THREE.BufferGeometry {
    const seg = this.map.terrain.segments;
    const size = this.map.size;
    const n = seg + 1;
    const half = size / 2;
    const positions = new Float32Array(n * n * 3);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const idx = j * n + i;
        const x = -half + (i / seg) * size;
        const z = -half + (j / seg) * size;
        const y = this.map.terrain.heights[idx] ?? 0;
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;
      }
    }
    const indices: number[] = [];
    for (let j = 0; j < seg; j++) {
      for (let i = 0; i < seg; i++) {
        const a = j * n + i;
        const b = j * n + i + 1;
        const c = (j + 1) * n + i;
        const d = (j + 1) * n + i + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }

  private rebuildTerrain() {
    this.terrainMesh.geometry.dispose();
    this.terrainMesh.geometry = this.buildTerrainGeometry();
  }

  private buildInstances() {
    this.instanceGroup.clear();
    for (const inst of this.map.instances) {
      const asset = this.assets.get(inst.assetId);
      if (!asset) continue; // unknown referenced asset — skip gracefully
      const wrapper = new THREE.Group();
      wrapper.userData.instanceId = inst.id;
      const obj = buildPartObject(asset.root);
      obj.position.set(inst.position.x, inst.position.y, inst.position.z);
      obj.rotation.set(inst.rotation.x, inst.rotation.y, inst.rotation.z);
      obj.scale.set(inst.scale.x, inst.scale.y, inst.scale.z);
      wrapper.add(obj);
      wrapper.traverse((o) => {
        o.userData.instanceId = inst.id;
      });
      this.instanceGroup.add(wrapper);
    }
    this.refreshInstanceSelection();
  }

  /** Replace the map data and (re)build the scene; keeps current mode/selection. */
  setData(map: MapComponent, assets: Map<string, AssetComponent>) {
    this.map = map;
    this.assets = assets;
    this.rebuildTerrain();
    this.grid.scale.setScalar(1);
    this.updateWater();
    this.buildInstances();
  }

  setAssets(assets: Map<string, AssetComponent>) {
    this.assets = assets;
    this.buildInstances();
  }

  setMode(mode: MapEditMode) {
    this.mode = mode;
    // Disable orbit while sculpting so drags paint instead of rotating.
    this.controls.enabled = mode === 'roam' || mode === 'place' || mode === 'select';
  }

  setPlaceAsset(assetId: string | null) {
    this.placeAssetId = assetId;
  }

  setSelectedInstance(id: string | null) {
    this.selectedInstanceId = id;
    this.refreshInstanceSelection();
  }

  setWater(level: number, enabled: boolean) {
    this.map.water.level = level;
    this.map.water.enabled = enabled;
    this.updateWater();
  }

  private updateWater() {
    this.waterMesh.position.y = this.map.water.level;
    this.waterMesh.visible = this.map.water.enabled;
    (this.waterMesh.material as THREE.MeshStandardMaterial).color = new THREE.Color(this.map.water.color);
  }

  private resize() {
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 400;
    this.renderer.setSize(w, h);
    const el = this.renderer.domElement;
    el.style.display = 'block';
    el.style.width = '100%';
    el.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private getMouse(ev: PointerEvent): THREE.Vector2 {
    const rect = this.renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1,
    );
  }

  private raycastTerrain(ev: PointerEvent): THREE.Intersection | null {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(this.getMouse(ev), this.camera);
    const hits = ray.intersectObject(this.terrainMesh, false);
    return hits.length ? hits[0] : null;
  }

  private raycastInstance(ev: PointerEvent): string | null {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(this.getMouse(ev), this.camera);
    const hits = ray.intersectObjects(this.instanceGroup.children, true);
    if (!hits.length) return null;
    let o: THREE.Object3D | null = hits[0].object;
    while (o && !o.userData.instanceId) o = o.parent;
    return (o?.userData.instanceId as string) ?? null;
  }

  private applyBrush(point: THREE.Vector3) {
    const seg = this.map.terrain.segments;
    const n = seg + 1;
    const pos = this.terrainMesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    const radius = this.brushRadius;
    const strength = this.brushStrength;

    let flatTarget = 0;
    if (this.mode === 'flatten') {
      let best = Infinity;
      for (let k = 0; k < n * n; k++) {
        const dx = pos.getX(k) - point.x;
        const dz = pos.getZ(k) - point.z;
        const d = dx * dx + dz * dz;
        if (d < best) {
          best = d;
          flatTarget = pos.getY(k);
        }
      }
    }

    let changed = false;
    for (let k = 0; k < n * n; k++) {
      const vx = pos.getX(k);
      const vz = pos.getZ(k);
      const dx = vx - point.x;
      const dz = vz - point.z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d > radius) continue;
      const f = 1 - d / radius;
      let h = pos.getY(k);
      if (this.mode === 'raise') h += strength * f;
      else if (this.mode === 'lower') h -= strength * f;
      else if (this.mode === 'flatten') h += (flatTarget - h) * f * 0.5;
      else continue;
      pos.setY(k, h);
      this.map.terrain.heights[k] = h; // keep persisted data in sync
      changed = true;
    }
    if (changed) {
      pos.needsUpdate = true;
      this.terrainMesh.geometry.computeVertexNormals();
      this.onChange();
    }
  }

  private onPointerDown = (ev: PointerEvent) => {
    if (this.mode === 'roam') return; // OrbitControls handles it
    if (this.mode === 'raise' || this.mode === 'lower' || this.mode === 'flatten') {
      this.painting = true;
      const hit = this.raycastTerrain(ev);
      if (hit) this.applyBrush(hit.point);
      return;
    }
    if (this.mode === 'place') {
      if (!this.placeAssetId) return;
      const hit = this.raycastTerrain(ev);
      if (hit) this.onPlace({ x: hit.point.x, y: hit.point.y, z: hit.point.z });
      return;
    }
    if (this.mode === 'select') {
      const id = this.raycastInstance(ev);
      this.selectedInstanceId = id;
      this.refreshInstanceSelection();
      this.onSelectInstance(id);
      return;
    }
  };

  private onPointerMove = (ev: PointerEvent) => {
    if (!this.painting) return;
    if (this.mode === 'raise' || this.mode === 'lower' || this.mode === 'flatten') {
      const hit = this.raycastTerrain(ev);
      if (hit) this.applyBrush(hit.point);
    }
  };

  private onPointerUp = () => {
    this.painting = false;
  };

  private refreshInstanceSelection() {
    const sel = this.selectedInstanceId;
    this.instanceGroup.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const m = mesh.material as THREE.MeshStandardMaterial;
        if (m && 'emissive' in m) {
          const instId = (o.userData?.instanceId as string) ?? undefined;
          const isSel = !!instId && instId === sel;
          m.emissive = new THREE.Color(isSel ? '#ffb300' : '#000000');
          m.emissiveIntensity = isSel ? 0.6 : 0;
        }
      }
    });
  }

  /** Re-sync instance meshes after the underlying instance list changed. */
  refreshInstances() {
    this.buildInstances();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  captureThumbnail(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  dispose() {
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('resize', () => this.resize());
    this.renderer.dispose();
    this.controls.dispose();
  }
}
