import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import type { AssetPart } from '@shape-craft/schema';
import { buildPartObject, type RefResolver } from './scene-graph.ts';

export type TransformMode = 'translate' | 'rotate' | 'scale';

export interface TransformTarget {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export class Viewport {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private transform: TransformControls;
  private rootGroup = new THREE.Group();
  private selectedId: string | null = null;
  private selectedHolder: THREE.Object3D | null = null;
  private onSelect: (id: string | null) => void;
  private onTransform: (id: string, t: TransformTarget) => void;
  private grid: THREE.GridHelper;
  private frameCallbacks: Array<(dt: number) => void> = [];
  private clock = new THREE.Clock();

  constructor(
    container: HTMLElement,
    onSelect: (id: string | null) => void,
    onTransform: (id: string, t: TransformTarget) => void,
  ) {
    this.container = container;
    this.onSelect = onSelect;
    this.onTransform = onTransform;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1b1d23');

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(4, 3, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 1, 0);

    this.transform = new TransformControls(this.camera, this.renderer.domElement);
    this.transform.setSize(0.8);
    this.transform.addEventListener('dragging-changed', (e) => {
      this.controls.enabled = !(e as unknown as { value: boolean }).value;
    });
    this.transform.addEventListener('objectChange', () => this.emitTransform());
    this.scene.add(this.transform.getHelper());

    const hemi = new THREE.HemisphereLight('#ffffff', '#444455', 1.1);
    this.scene.add(hemi);
    const dir = new THREE.DirectionalLight('#ffffff', 1.4);
    dir.position.set(5, 8, 4);
    this.scene.add(dir);

    this.grid = new THREE.GridHelper(20, 20, '#3a3d47', '#2a2c33');
    this.scene.add(this.grid);

    this.scene.add(this.rootGroup);

    this.renderer.domElement.addEventListener('pointerdown', (e) => this.handlePick(e));
    window.addEventListener('resize', () => this.resize());
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.container);
    this.resize();
    this.animate();
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

  private handlePick(ev: PointerEvent) {
    // Ignore clicks that land on the transform gizmo so we don't deselect
    // the part while the user is dragging it.
    if (this.transform.dragging || this.transform.axis) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, this.camera);
    const hits = ray.intersectObjects(this.rootGroup.children, true);
    if (hits.length === 0) {
      this.onSelect(null);
      return;
    }
    let obj: THREE.Object3D | null = hits[0].object;
    while (obj && !obj.userData.partId) obj = obj.parent;
    this.onSelect((obj?.userData.partId as string) ?? null);
  }

  setRoot(part: AssetPart, resolve: RefResolver = () => null) {
    this.rootGroup.clear();
    this.rootGroup.add(buildPartObject(part, resolve));
    this.refreshSelection();
    // The scene graph was rebuilt, so any previous holder reference is dead;
    // re-attach the gizmo to the freshly built holder if a part is selected.
    this.attachGizmo(this.selectedId);
  }

  setSelected(id: string | null) {
    this.selectedId = id;
    this.refreshSelection();
    this.attachGizmo(id);
  }

  setTransformMode(mode: TransformMode) {
    this.transform.setMode(mode);
  }

  getTransformMode(): TransformMode {
    return this.transform.getMode();
  }

  private findHolder(id: string): THREE.Object3D | null {
    let found: THREE.Object3D | null = null;
    this.rootGroup.traverse((o) => {
      if (!found && o.userData.partId === id && (o as THREE.Group).isGroup) found = o;
    });
    return found;
  }

  private attachGizmo(id: string | null) {
    if (!id) {
      this.transform.detach();
      this.selectedHolder = null;
      return;
    }
    const holder = this.findHolder(id);
    if (holder) {
      this.transform.attach(holder);
      this.selectedHolder = holder;
    } else {
      this.transform.detach();
      this.selectedHolder = null;
    }
  }

  private emitTransform() {
    const h = this.selectedHolder;
    if (!h || !this.selectedId) return;
    this.onTransform(this.selectedId, {
      position: { x: h.position.x, y: h.position.y, z: h.position.z },
      rotation: { x: h.rotation.x, y: h.rotation.y, z: h.rotation.z },
      scale: { x: h.scale.x, y: h.scale.y, z: h.scale.z },
    });
  }

  private refreshSelection() {
    const selected = this.selectedId;
    this.rootGroup.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (m && 'emissive' in m) {
          // A mesh is highlighted if it belongs to the selected part OR lives
          // anywhere inside the selected part's subtree. We walk up the holder
          // chain because a `node` has no mesh of its own — selecting it must
          // still highlight every descendant mesh (the node's whole subtree).
          let isSel = false;
          let cur: THREE.Object3D | null = o;
          while (cur) {
            if (cur.userData.partId === selected) {
              isSel = true;
              break;
            }
            cur = cur.parent;
          }
          m.emissive = new THREE.Color(isSel ? '#ffb300' : '#000000');
          m.emissiveIntensity = isSel ? 0.6 : 0;
        }
      }
    });
  }

  getSelectedId(): string | null {
    return this.selectedId;
  }

  /** The root group holding the current asset scene graph. */
  getRootGroup(): THREE.Group {
    return this.rootGroup;
  }

  /**
   * Register a per-frame callback (delta seconds). Used by the character
   * animation system to drive bone rotations every frame without rebuilding
   * the scene graph.
   */
  onFrame(cb: (dt: number) => void): () => void {
    this.frameCallbacks.push(cb);
    return () => {
      this.frameCallbacks = this.frameCallbacks.filter((c) => c !== cb);
    };
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
    window.removeEventListener('resize', () => this.resize());
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    const dt = this.clock.getDelta();
    for (const cb of this.frameCallbacks) cb(dt);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
