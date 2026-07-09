/**
 * Rule-based prefab generators.
 *
 * Each generator returns an `AssetPart` tree (the root part) for a known
 * component type. The chat agent and the "quick create" buttons use these to
 * auto-build components from basic primitives + basic materials without any
 * external AI service.
 */
import {
  AssetCategory,
  AssetPart,
  createPart,
  defaultMaterial,
  recenterPartTree,
  uid,
  vec3,
} from './index.ts';

function mat(color: string) {
  return defaultMaterial(color);
}

/** A simple low-poly tree: brown trunk + stacked green foliage. */
export function buildTree(): AssetPart {
  const trunk = createPart({
    name: 'Trunk',
    shape: 'cylinder',
    size: vec3(0.18, 1.2, 0.18),
    position: vec3(0, 0.6, 0),
    material: mat('#7a4f2a'),
  });

  const foliageLower = createPart({
    name: 'FoliageBottom',
    shape: 'cone',
    size: vec3(0.9, 1.1, 0.9),
    // Position is relative to the parent (Trunk at y=0.6), so the foliage sits
    // at world y≈1.7 once the parent transform propagates to children.
    position: vec3(0, 1.1, 0),
    material: mat('#3f8f3a'),
  });
  const foliageUpper = createPart({
    name: 'FoliageTop',
    shape: 'cone',
    size: vec3(0.6, 0.9, 0.6),
    position: vec3(0, 1.9, 0),
    material: mat('#4caf50'),
  });

  trunk.children.push(foliageLower, foliageUpper);
  return recenterPartTree(
    createPart({
      name: 'Tree',
      shape: 'box',
      size: vec3(0.01, 0.01, 0.01),
      material: mat('#000000'),
      children: [trunk],
    }),
  );
}

/** A flower: green stem + colored petals + yellow center. */
export function buildFlower(): AssetPart {
  const stem = createPart({
    name: 'Stem',
    shape: 'cylinder',
    size: vec3(0.05, 0.6, 0.05),
    position: vec3(0, 0.3, 0),
    material: mat('#3f8f3a'),
  });

  const petalColors = ['#ff5d8f', '#ff9a3c', '#ffd23f', '#b06bff', '#5db8ff'];
  const petals: AssetPart[] = [];
  const count = 5;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    petals.push(
      createPart({
        name: `Petal${i + 1}`,
        shape: 'sphere',
        size: vec3(0.16, 0.06, 0.1),
        position: vec3(Math.cos(angle) * 0.22, 0.62, Math.sin(angle) * 0.22),
        rotation: vec3(0, -angle, 0.4),
        material: mat(petalColors[i % petalColors.length]),
      }),
    );
  }

  const center = createPart({
    name: 'Center',
    shape: 'sphere',
    size: vec3(0.14, 0.14, 0.14),
    position: vec3(0, 0.62, 0),
    material: mat('#ffd23f'),
  });

  return recenterPartTree(
    createPart({
      name: 'Flower',
      shape: 'box',
      size: vec3(0.01, 0.01, 0.01),
      material: mat('#000000'),
      children: [stem, ...petals, center],
    }),
  );
}

/** A tuft of grass: several thin green blades. */
export function buildGrass(): AssetPart {
  const blades: AssetPart[] = [];
  const positions: Array<[number, number]> = [
    [-0.25, -0.2],
    [0.0, -0.25],
    [0.25, -0.15],
    [-0.1, 0.15],
    [0.15, 0.1],
    [0.0, 0.0],
  ];
  positions.forEach(([x, z], i) => {
    blades.push(
      createPart({
        name: `Blade${i + 1}`,
        shape: 'cone',
        size: vec3(0.06, 0.4 + (i % 3) * 0.08, 0.06),
        position: vec3(x, 0.2 + (i % 3) * 0.04, z),
        rotation: vec3((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4),
        material: mat(i % 2 === 0 ? '#5bbf4a' : '#3f8f3a'),
      }),
    );
  });
  return recenterPartTree(
    createPart({
      name: 'Grass',
      shape: 'box',
      size: vec3(0.01, 0.01, 0.01),
      material: mat('#000000'),
      children: blades,
    }),
  );
}

/** A small house: box walls + pyramid roof + door + window. */
export function buildHouse(): AssetPart {
  const walls = createPart({
    name: 'Walls',
    shape: 'box',
    size: vec3(1.4, 1.0, 1.4),
    position: vec3(0, 0.5, 0),
    material: mat('#e8d9b5'),
  });

  const roof = createPart({
    name: 'Roof',
    shape: 'cone',
    size: vec3(1.15, 0.8, 1.15),
    position: vec3(0, 1.4, 0),
    rotation: vec3(0, Math.PI / 4, 0),
    material: mat('#b5482f'),
  });

  const door = createPart({
    name: 'Door',
    shape: 'box',
    size: vec3(0.35, 0.6, 0.05),
    position: vec3(0, 0.3, 0.71),
    material: mat('#6b4226'),
  });

  const windowL = createPart({
    name: 'WindowL',
    shape: 'box',
    size: vec3(0.3, 0.3, 0.05),
    position: vec3(-0.45, 0.6, 0.71),
    material: mat('#7ec8ff'),
  });
  const windowR = createPart({
    name: 'WindowR',
    shape: 'box',
    size: vec3(0.3, 0.3, 0.05),
    position: vec3(0.45, 0.6, 0.71),
    material: mat('#7ec8ff'),
  });

  return recenterPartTree(
    createPart({
      name: 'House',
      shape: 'box',
      size: vec3(0.01, 0.01, 0.01),
      material: mat('#000000'),
      children: [walls, roof, door, windowL, windowR],
    }),
  );
}

export interface PrefabTemplate {
  key: AssetCategory | 'rock';
  label: string;
  build: () => AssetPart;
  defaultName: string;
}

export const PREFAB_TEMPLATES: PrefabTemplate[] = [
  { key: 'tree', label: 'Tree 树', build: buildTree, defaultName: 'Tree' },
  { key: 'flower', label: 'Flower 花', build: buildFlower, defaultName: 'Flower' },
  { key: 'grass', label: 'Grass 草', build: buildGrass, defaultName: 'Grass Tuft' },
  { key: 'house', label: 'House 房子', build: buildHouse, defaultName: 'House' },
];

export function templateByKey(key: string): PrefabTemplate | undefined {
  return PREFAB_TEMPLATES.find((t) => t.key === key);
}

export const _uid = uid;
