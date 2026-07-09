/**
 * Theme prefab generators — the "火车大劫案 Train Robbery" set.
 *
 * Builders here produce either plain prop `AssetPart` trees ( locomotive / train
 * car / rail / tree ) or character rigs (a rider mounted on a horse, a
 * standing person with a hat and a gun). Composites (cavalry) are built on top
 * of the stock quadruped / humanoid rigs so the existing walk / idle clips keep
 * working, with extra mesh parts parented under the relevant bone so they move
 * with the skeleton.
 *
 * All builders recenter their geometry, so the director can ground each object
 * with `groundOffsetY(root)`.
 */
import {
  AssetPart,
  CharacterRig,
  CharacterType,
  createPart,
  defaultMaterial,
  groundOffsetY,
  recenterPartTree,
  vec3,
  buildCharacterRoot,
  CHARACTER_RIGS,
  type AssetInput,
  type PartMaterial,
} from './index.ts';
import { PREFAB_TEMPLATES, type PrefabTemplate } from './templates.ts';

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function cloneRig(rig: CharacterRig): CharacterRig {
  return JSON.parse(JSON.stringify(rig)) as CharacterRig;
}

/** Recolor every joint's mesh via a name → color mapper. */
function recolorRig(rig: CharacterRig, map: (name: string) => string | undefined): CharacterRig {
  const r = cloneRig(rig);
  for (const j of r.joints) {
    if (j.mesh) {
      const c = map(j.name);
      if (c) j.mesh = { ...j.mesh, color: c };
    }
  }
  return r;
}

/** Find a part by (bone) name, depth-first. */
function findPart(root: AssetPart, name: string): AssetPart | null {
  if (root.name === name) return root;
  for (const c of root.children) {
    const f = findPart(c, name);
    if (f) return f;
  }
  return null;
}

const STEEL = (c = '#2c2f36'): PartMaterial => ({ ...defaultMaterial(c), roughness: 0.55, metalness: 0.6 });
const MATTE = (c: string): PartMaterial => ({ ...defaultMaterial(c), roughness: 0.85, metalness: 0.05 });

// ---------------------------------------------------------------------------
// Props (non-character)
// ---------------------------------------------------------------------------

/** Steam locomotive, facing +X (length along X). */
export function buildLocomotive(): AssetPart {
  const wheelR = 0.7;
  const root = createPart({
    shape: 'node',
    name: 'Locomotive',
    children: [
      // running board / frame
      createPart({ shape: 'box', name: 'Frame', size: vec3(7.4, 0.35, 2.7), position: vec3(0, 0.4, 0), material: STEEL('#23262c') }),
      // boiler (cylinder lying along X)
      createPart({ shape: 'cylinder', name: 'Boiler', size: vec3(1.05, 4.6, 1.05), position: vec3(-0.3, 1.45, 0), rotation: vec3(0, 0, Math.PI / 2), material: STEEL('#3a3f47') }),
      // smokebox front
      createPart({ shape: 'cylinder', name: 'Smokebox', size: vec3(1.12, 0.6, 1.12), position: vec3(2.2, 1.45, 0), rotation: vec3(0, 0, Math.PI / 2), material: MATTE('#7a1f1f') }),
      // cabin
      createPart({ shape: 'box', name: 'Cabin', size: vec3(2.4, 2.3, 2.5), position: vec3(-2.7, 1.65, 0), material: MATTE('#5a3a22') }),
      createPart({ shape: 'box', name: 'CabinRoof', size: vec3(2.7, 0.22, 2.7), position: vec3(-2.7, 2.85, 0), material: MATTE('#33220f') }),
      // chimney + steam dome
      createPart({ shape: 'cylinder', name: 'Chimney', size: vec3(0.36, 1.1, 0.36), position: vec3(1.5, 2.7, 0), material: MATTE('#1c1c1c') }),
      createPart({ shape: 'sphere', name: 'Dome', size: vec3(0.45, 0.45, 0.45), position: vec3(0.2, 2.55, 0), material: STEEL('#8a8f99') }),
      // cowcatcher (wedge)
      createPart({ shape: 'box', name: 'Cowcatcher', size: vec3(1.3, 1.0, 2.3), position: vec3(3.0, 0.75, 0), rotation: vec3(0, 0, -Math.PI / 7), material: MATTE('#3a3a3a') }),
      // headlamp
      createPart({ shape: 'sphere', name: 'Lamp', size: vec3(0.28, 0.28, 0.28), position: vec3(2.6, 1.7, 0), material: MATTE('#ffd76b') }),
      // drive / trailing wheels (cylinder discs facing ±X)
      ...[-2.0, -0.6, 0.8, 2.0].map((x) =>
        createPart({ shape: 'cylinder', name: `Wheel@${x}`, size: vec3(wheelR, 0.3, wheelR), position: vec3(x, wheelR, 0), rotation: vec3(0, 0, Math.PI / 2), material: STEEL('#15171b') }),
      ),
    ],
  });
  return recenterPartTree(root);
}

/** Freight / passenger car, facing +X. */
export function buildTrainCar(): AssetPart {
  const root = createPart({
    shape: 'node',
    name: 'TrainCar',
    children: [
      createPart({ shape: 'box', name: 'Frame', size: vec3(5.2, 0.3, 2.4), position: vec3(0, 0.45, 0), material: STEEL('#23262c') }),
      createPart({ shape: 'box', name: 'Body', size: vec3(5.0, 1.9, 2.4), position: vec3(0, 1.35, 0), material: MATTE('#7a4a23') }),
      createPart({ shape: 'box', name: 'Roof', size: vec3(5.2, 0.22, 2.6), position: vec3(0, 2.4, 0), material: MATTE('#3c2a14') }),
      // doors / panel hint
      createPart({ shape: 'box', name: 'Door', size: vec3(0.1, 1.4, 1.4), position: vec3(1.2, 1.35, 0), material: MATTE('#5e3819') }),
      // wheels
      ...[-1.6, 1.6].flatMap((x) => [
        createPart({ shape: 'cylinder', name: `WheelL@${x}`, size: vec3(0.5, 0.22, 0.5), position: vec3(x, 0.5, 0.95), rotation: vec3(0, 0, Math.PI / 2), material: STEEL('#15171b') }),
        createPart({ shape: 'cylinder', name: `WheelR@${x}`, size: vec3(0.5, 0.22, 0.5), position: vec3(x, 0.5, -0.95), rotation: vec3(0, 0, Math.PI / 2), material: STEEL('#15171b') }),
      ]),
    ],
  });
  return recenterPartTree(root);
}

/** A straight rail segment of a given length (along X) with sleepers. */
export function buildRail(length = 72): AssetPart {
  const ties: AssetPart[] = [];
  const step = 1.6;
  for (let x = -length / 2 + step / 2; x < length / 2; x += step) {
    ties.push(
      createPart({ shape: 'box', name: `Tie@${x.toFixed(1)}`, size: vec3(0.32, 0.14, 1.9), position: vec3(x, 0.07, 0), material: MATTE('#5a3d23') }),
    );
  }
  const root = createPart({
    shape: 'node',
    name: 'Rail',
    children: [
      ...ties,
      createPart({ shape: 'box', name: 'RailL', size: vec3(length, 0.15, 0.14), position: vec3(0, 0.18, 0.72), material: STEEL('#6a6f78') }),
      createPart({ shape: 'box', name: 'RailR', size: vec3(length, 0.15, 0.14), position: vec3(0, 0.18, -0.72), material: STEEL('#6a6f78') }),
    ],
  });
  return recenterPartTree(root);
}

/** A simple pine tree. */
export function buildTree(): AssetPart {
  const root = createPart({
    shape: 'node',
    name: 'Tree',
    children: [
      createPart({ shape: 'cylinder', name: 'Trunk', size: vec3(0.26, 2.0, 0.26), position: vec3(0, 1.0, 0), material: MATTE('#6b4a23') }),
      createPart({ shape: 'cone', name: 'Foliage1', size: vec3(1.6, 2.0, 1.6), position: vec3(0, 2.8, 0), material: MATTE('#2f7d32') }),
      createPart({ shape: 'cone', name: 'Foliage2', size: vec3(1.2, 1.7, 1.2), position: vec3(0, 3.7, 0), material: MATTE('#37933b') }),
      createPart({ shape: 'cone', name: 'Foliage3', size: vec3(0.8, 1.4, 0.8), position: vec3(0, 4.4, 0), material: MATTE('#43a648') }),
    ],
  });
  return recenterPartTree(root);
}

// ---------------------------------------------------------------------------
// Characters
// ---------------------------------------------------------------------------

/** A horse (quadruped rig, brown) with a rider mounted on its back. */
export function buildCavalry(opts: { horse?: string; coat?: string; hat?: string; rider?: string } = {}): AssetPart {
  const horse = opts.horse ?? '#9a6a35';
  const horseLeg = opts.horse ? shade(opts.horse, -0.25) : '#6f4a22';
  const horseHead = opts.horse ? shade(opts.horse, 0.12) : '#a8743a';
  const coat = opts.coat ?? '#3a2b2b';
  const hat = opts.hat ?? '#1c1c1c';
  const skin = '#e8b98a';

  const rig = recolorRig(CHARACTER_RIGS.quadruped, (name) => {
    if (name === 'joint.head') return horseHead;
    if (name.startsWith('joint.leg') || name.startsWith('joint.knee')) return horseLeg;
    return horse;
  });
  const root = buildCharacterRoot(rig);
  const body = findPart(root, 'joint.body');
  if (body) {
    body.children.push(
      // rider torso sitting astride the back
      createPart({ shape: 'box', name: 'rider.torso', size: vec3(0.36, 0.55, 0.24), position: vec3(0, 0.62, 0.0), material: MATTE(coat) }),
      createPart({ shape: 'box', name: 'rider.hip', size: vec3(0.34, 0.22, 0.26), position: vec3(0, 0.34, 0.0), material: MATTE(shade(coat, -0.2)) }),
      createPart({ shape: 'sphere', name: 'rider.head', size: vec3(0.16, 0.16, 0.16), position: vec3(0, 1.0, 0.05), material: MATTE(skin) }),
      // hat: crown + brim
      createPart({ shape: 'cylinder', name: 'rider.hat', size: vec3(0.2, 0.2, 0.2), position: vec3(0, 1.12, 0.05), material: MATTE(hat) }),
      createPart({ shape: 'box', name: 'rider.hatBrim', size: vec3(0.44, 0.06, 0.44), position: vec3(0, 1.03, 0.05), material: MATTE(hat) }),
      // arms reaching forward, gripping a rifle pointed along +Z
      createPart({ shape: 'box', name: 'rider.armL', size: vec3(0.1, 0.46, 0.1), position: vec3(-0.22, 0.66, 0.22), rotation: vec3(Math.PI / 2.2, 0, 0), material: MATTE(coat) }),
      createPart({ shape: 'box', name: 'rider.armR', size: vec3(0.1, 0.46, 0.1), position: vec3(0.22, 0.66, 0.22), rotation: vec3(Math.PI / 2.2, 0, 0), material: MATTE(coat) }),
      createPart({ shape: 'box', name: 'rider.gun', size: vec3(0.07, 0.07, 0.85), position: vec3(0.22, 0.55, 0.5), material: STEEL('#15171b') }),
    );
  }
  return recenterPartTree(root);
}

/** A standing person (humanoid rig) with a hat and a rifle. */
export function buildPerson(opts: { coat?: string; hat?: string; pants?: string } = {}): AssetPart {
  const coat = opts.coat ?? '#2f5f9f';
  const pants = opts.pants ?? '#2a2f3a';
  const hat = opts.hat ?? '#3a2a18';
  const skin = '#e8b98a';

  const rig = recolorRig(CHARACTER_RIGS.humanoid, (name) => {
    if (name.startsWith('joint.leg') || name.startsWith('joint.knee')) return pants;
    if (name === 'joint.head') return skin;
    return coat;
  });
  const root = buildCharacterRoot(rig);
  const head = findPart(root, 'joint.head');
  if (head) {
    head.children.push(
      createPart({ shape: 'cylinder', name: 'person.hat', size: vec3(0.2, 0.22, 0.2), position: vec3(0, 0.22, 0.0), material: MATTE(hat) }),
      createPart({ shape: 'box', name: 'person.hatBrim', size: vec3(0.46, 0.06, 0.46), position: vec3(0, 0.12, 0.0), material: MATTE(hat) }),
    );
  }
  const spine = findPart(root, 'joint.spine');
  if (spine) {
    spine.children.push(
      createPart({ shape: 'box', name: 'person.armL', size: vec3(0.11, 0.46, 0.11), position: vec3(-0.2, 0.2, 0.26), rotation: vec3(Math.PI / 2.1, 0, 0), material: MATTE(coat) }),
      createPart({ shape: 'box', name: 'person.armR', size: vec3(0.11, 0.46, 0.11), position: vec3(0.2, 0.2, 0.26), rotation: vec3(Math.PI / 2.1, 0, 0), material: MATTE(coat) }),
      createPart({ shape: 'box', name: 'person.gun', size: vec3(0.07, 0.07, 0.9), position: vec3(0.2, 0.18, 0.55), material: STEEL('#15171b') }),
    );
  }
  return recenterPartTree(root);
}

/** Lighten / darken a hex color by `amt` in [-1, 1]. */
function shade(hex: string, amt: number): string {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!m) return hex;
  const f = (h: string) => {
    const v = parseInt(h, 16);
    const nv = Math.max(0, Math.min(255, Math.round(v + amt * 255)));
    return nv.toString(16).padStart(2, '0');
  };
  return `#${f(m[1])}${f(m[2])}${f(m[3])}`;
}

// ---------------------------------------------------------------------------
// Asset-input wrappers (for the data layer / library)
// ---------------------------------------------------------------------------

export function locomotiveAsset(name = '火车头 Locomotive'): AssetInput {
  return { name, category: 'decor', description: '蒸汽火车头：锅炉 + 驾驶室 + 烟囱 + 排障器 + 车轮。', root: buildLocomotive() };
}
export function trainCarAsset(name = '火车车厢 Train Car'): AssetInput {
  return { name, category: 'decor', description: '货运/客运车厢：车厢 + 车顶 + 车轮。', root: buildTrainCar() };
}
export function railAsset(name = '铁轨 Rail'): AssetInput {
  return { name, category: 'road', description: '铁轨：两条钢轨 + 枕木。', root: buildRail() };
}
export function treeAsset(name = '树木 Tree'): AssetInput {
  return { name, category: 'tree', description: '松木：树干 + 三层锥形树冠。', root: buildTree() };
}
export function cavalryBanditAsset(name = '劫匪骑兵 Bandit'): AssetInput {
  return { name, category: 'character', characterType: 'quadruped' as CharacterType, description: '骑马劫匪：四足马 + 持枪骑手。', root: buildCavalry({ coat: '#3a2b2b', hat: '#111' }) };
}
export function cavalryDefenderAsset(name = '护卫骑兵 Defender'): AssetInput {
  return { name, category: 'character', characterType: 'quadruped' as CharacterType, description: '骑马护卫：四足马 + 持枪骑手。', root: buildCavalry({ coat: '#274b73', hat: '#222' }) };
}
export function defenderAsset(name = '火车护卫 Defender'): AssetInput {
  return { name, category: 'character', characterType: 'humanoid' as CharacterType, description: '站立持枪护卫。', root: buildPerson({ coat: '#2f5f9f', hat: '#3a2a18' }) };
}

// Register the prop prefabs into the library quick-create bar (characters are
// authored through the character editor, so only the prop kinds go here).
PREFAB_TEMPLATES.push(
  {
    key: 'decor',
    label: '🚂 火车头 Locomotive',
    defaultName: '火车头 Locomotive',
    build: buildLocomotive,
  } satisfies PrefabTemplate,
  {
    key: 'decor',
    label: '🚃 火车车厢 Train Car',
    defaultName: '火车车厢 Train Car',
    build: buildTrainCar,
  } satisfies PrefabTemplate,
  {
    key: 'road',
    label: '🛤 铁轨 Rail',
    defaultName: '铁轨 Rail',
    build: () => buildRail(),
  } satisfies PrefabTemplate,
  {
    key: 'tree',
    label: '🌲 树木 Tree',
    defaultName: '树木 Tree',
    build: buildTree,
  } satisfies PrefabTemplate,
);

export { groundOffsetY };
