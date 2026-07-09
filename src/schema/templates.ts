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
  PartMaterial,
  createPart,
  defaultMaterial,
  recenterPartTree,
  uid,
} from './index.ts';

export interface PrefabTemplate {
  key: AssetCategory | 'rock';
  label: string;
  build: () => AssetPart;
  defaultName: string;
}

/**
 * Build the "瀑布 Waterfall" prefab: a translucent vertical water sheet framed
 * by rocky walls, with a top ledge and a shallow pool at the base. The root is
 * recentered so it can be placed/rotated around its middle.
 */
export function buildWaterfall(): AssetPart {
  const rock = defaultMaterial('#6b6b6b', 1);
  const darkRock: PartMaterial = { ...defaultMaterial('#4f4f4f'), roughness: 1, metalness: 0 };
  const waterMat: PartMaterial = { ...defaultMaterial('#4aa3e0', 0.62), roughness: 0.1, metalness: 0.15 };
  const poolMat: PartMaterial = { ...defaultMaterial('#3a8fd0', 0.7), roughness: 0.15, metalness: 0.1 };

  const root = createPart({
    shape: 'node',
    name: 'Waterfall',
    children: [
      // Back wall the water spills over.
      createPart({ shape: 'box', name: 'BackRock', size: { x: 3.0, y: 3.2, z: 0.5 }, position: { x: 0, y: 0, z: -0.55 }, material: darkRock }),
      // Side walls.
      createPart({ shape: 'box', name: 'LeftRock', size: { x: 0.6, y: 3.2, z: 1.2 }, position: { x: -1.2, y: 0, z: 0 }, material: rock }),
      createPart({ shape: 'box', name: 'RightRock', size: { x: 0.6, y: 3.2, z: 1.2 }, position: { x: 1.2, y: 0, z: 0 }, material: rock }),
      // The falling water sheet.
      createPart({ shape: 'plane', name: 'Water', size: { x: 1.8, y: 3.0, z: 1 }, position: { x: 0, y: 0, z: 0.05 }, material: waterMat }),
      // Top ledge the water pours from.
      createPart({ shape: 'box', name: 'TopLedge', size: { x: 3.0, y: 0.5, z: 1.4 }, position: { x: 0, y: 1.7, z: 0 }, material: rock }),
      // Shallow pool where it lands.
      createPart({ shape: 'box', name: 'Pool', size: { x: 3.0, y: 0.3, z: 1.6 }, position: { x: 0, y: -1.55, z: 0.2 }, material: poolMat }),
    ],
  });
  return recenterPartTree(root);
}

/** Wrap a part-tree builder into a full AssetComponent (no id/timestamps). */
export function buildWaterfallAsset(name = '瀑布 Waterfall'): Omit<import('./index.ts').AssetComponent, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name,
    category: 'waterfall',
    description: '预制瀑布：半透明水帘 + 岩石框架 + 底部水潭。',
    root: buildWaterfall(),
    thumbnail: undefined,
  };
}

export const PREFAB_TEMPLATES: PrefabTemplate[] = [
  {
    key: 'waterfall',
    label: '🌊 瀑布 Waterfall',
    defaultName: '瀑布 Waterfall',
    build: buildWaterfall,
  },
];

export function templateByKey(key: string): PrefabTemplate | undefined {
  return PREFAB_TEMPLATES.find((t) => t.key === key);
}

export const _uid = uid;
