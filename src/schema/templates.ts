/**
 * Rule-based prefab generators.
 *
 * Each generator returns an `AssetPart` tree (the root part) for a known
 * component type. The chat agent and the "quick create" presets use these to
 * auto-build components from basic primitives + basic materials without any
 * external AI service.
 */
import {
  AssetCategory,
  AssetPart,
  ScriptSlot,
  createPart,
  defaultMaterial,
  uid,
} from './index.ts';

export interface PrefabTemplate {
  key: AssetCategory | 'rock';
  label: string;
  build: () => AssetPart;
  defaultName: string;
}

/**
 * Firework script (Unity-style `update(t, dt)`). Stored as a custom script slot
 * on the "Launcher" part. It launches an ascending rocket every ~1.3s, then
 * bursts it into a radial spray of fading sparks when it reaches apex. All
 * particles are plain three.js meshes added to `scene` and recycled by the
 * script itself — no special particle system needed.
 */
const FIREWORK_CODE = `function explode(pos) {
  const n = 48;
  const color = new THREE.Color().setHSL(Math.random(), 1, 0.62);
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 6, 6),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.3, transparent: true, opacity: 1 })
    );
    m.position.copy(pos);
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize().multiplyScalar(2.2 + Math.random() * 1.6);
    scene.add(m);
    self.userData.sparks.push({ mesh: m, vx: dir.x, vy: dir.y, vz: dir.z, age: 0 });
  }
}

function update(t, dt) {
  const ud = self.userData;
  ud.rockets = ud.rockets || [];
  ud.sparks = ud.sparks || [];
  ud.launchT = (ud.launchT || 0) + dt;

  if (ud.launchT > 1.3) {
    ud.launchT = 0;
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffe08a, emissive: 0xffaa33, emissiveIntensity: 1.5 })
    );
    m.position.set(0, 0, 0);
    scene.add(m);
    ud.rockets.push({ mesh: m, vy: 4.5 + Math.random() * 1.5, age: 0 });
  }

  for (let i = ud.rockets.length - 1; i >= 0; i--) {
    const r = ud.rockets[i];
    r.age += dt; r.vy -= 6 * dt;
    r.mesh.position.y += r.vy * dt;
    if (r.vy <= 0.2 || r.age > 2.4) {
      explode(r.mesh.position.clone());
      scene.remove(r.mesh); r.mesh.geometry.dispose(); r.mesh.material.dispose();
      ud.rockets.splice(i, 1);
    }
  }

  for (let i = ud.sparks.length - 1; i >= 0; i--) {
    const s = ud.sparks[i];
    s.age += dt; s.vy -= 4 * dt;
    s.mesh.position.x += s.vx * dt;
    s.mesh.position.y += s.vy * dt;
    s.mesh.position.z += s.vz * dt;
    s.mesh.material.opacity = Math.max(0, 1 - s.age / 1.3);
    if (s.age > 1.3) {
      scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose();
      ud.sparks.splice(i, 1);
    }
  }
}`;

/** Build the "烟花 Firework" prefab: a launcher node driven by a custom script. */
export function buildFirework(): AssetPart {
  const launcher = createPart({
    shape: 'node',
    name: 'Launcher',
    material: defaultMaterial('#222222'),
  });
  const root = createPart({
    shape: 'node',
    name: 'Firework',
    children: [launcher],
  });
  return root;
}

/** Wrap the firework builder into a full AssetComponent (no id/timestamps). */
export function buildFireworkAsset(name = '烟花 Firework'): Omit<import('./index.ts').AssetComponent, 'id' | 'createdAt' | 'updatedAt'> {
  const root = buildFirework();
  const launcher = root.children.find((c) => c.name === 'Launcher')!;
  const slot: ScriptSlot = {
    id: uid(),
    partId: launcher.id,
    name: 'Firework',
    code: FIREWORK_CODE,
  };
  return {
    name,
    category: 'decor',
    description: '烟花：脚本持续发射上升弹，到顶爆开成放射状淡出粒子。',
    root,
    thumbnail: undefined,
    scripts: [slot],
  };
}

export const PREFAB_TEMPLATES: PrefabTemplate[] = [];

export function templateByKey(key: string): PrefabTemplate | undefined {
  return PREFAB_TEMPLATES.find((t) => t.key === key);
}
