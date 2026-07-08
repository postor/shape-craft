import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { AssetPart, ShapeType, Vec3 } from '@shape-craft/schema';

function geometryFor(shape: ShapeType, size: Vec3): THREE.BufferGeometry {
  switch (shape) {
    case 'box':
      return new THREE.BoxGeometry(size.x, size.y, size.z);
    case 'sphere':
      return new THREE.SphereGeometry(size.x, 32, 16);
    case 'cylinder':
      return new THREE.CylinderGeometry(size.x, size.x, size.y, 24);
    case 'cone':
      return new THREE.ConeGeometry(size.x, size.y, 24);
    case 'plane':
      return new THREE.PlaneGeometry(size.x, size.y);
    case 'triangle': {
      const w = size.x;
      const h = size.y;
      const g = new THREE.BufferGeometry();
      const verts = new Float32Array([-w / 2, 0, 0, w / 2, 0, 0, 0, h, 0]);
      g.setAttribute('position', new THREE.BufferAttribute(verts, 3));
      g.computeVertexNormals();
      return g;
    }
  }
}

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
    this.renderer.setSize(w, h, false);
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

  private buildPart(part: AssetPart): THREE.Object3D {
    const geo = geometryFor(part.shape, part.size);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(part.material.color),
      roughness: part.material.roughness,
      metalness: part.material.metalness,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.partId = part.id;
    mesh.position.set(part.position.x, part.position.y, part.position.z);
    mesh.rotation.set(part.rotation.x, part.rotation.y, part.rotation.z);
    mesh.scale.set(part.scale.x, part.scale.y, part.scale.z);

    const holder = new THREE.Group();
    holder.userData.partId = part.id;
    holder.add(mesh);

    for (const child of part.children) {
      holder.add(this.buildPart(child));
    }
    return holder;
  }

  setRoot(part: AssetPart) {
    this.rootGroup.clear();
    this.rootGroup.add(this.buildPart(part));
    this.refreshSelection();
  }

  setSelected(id: string | null) {
    this.selectedId = id;
    this.refreshSelection();
  }

  private refreshSelection() {
    this.rootGroup.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (m && 'emissive' in m) {
          const isSel = o.parent?.userData.partId === this.selectedId || o.userData.partId === this.selectedId;
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
