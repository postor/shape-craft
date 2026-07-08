import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { AssetPart } from '@shape-craft/schema';
import { buildPartObject } from './scene-graph.ts';

export class Viewport {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private rootGroup = new THREE.Group();
  private selectedId: string | null = null;
  private onSelect: (id: string | null) => void;
  private grid: THREE.GridHelper;

  constructor(container: HTMLElement, onSelect: (id: string | null) => void) {
    this.container = container;
    this.onSelect = onSelect;

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

  setRoot(part: AssetPart) {
    this.rootGroup.clear();
    this.rootGroup.add(buildPartObject(part));
    this.refreshSelection();
  }

  setSelected(id: string | null) {
    this.selectedId = id;
    this.refreshSelection();
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

  captureThumbnail(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  dispose() {
    this.renderer.dispose();
    this.controls.dispose();
    window.removeEventListener('resize', () => this.resize());
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
