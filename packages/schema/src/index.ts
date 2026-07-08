/**
 * Shared domain schema for ShapeCraft.
 *
 * These types describe an "Asset Component" (元件) — a reusable 3D prefab built
 * from primitive shapes + materials. They are shared by the frontend editor
 * and the backend asset service so the wire format stays stable.
 */

export type ShapeType = 'box' | 'sphere' | 'cylinder' | 'cone' | 'plane' | 'triangle';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface PartMaterial {
  /** Hex color, e.g. "#4caf50" */
  color: string;
  /** 0 = rough, 1 = glossy */
  roughness: number;
  /** 0 = non-metal, 1 = metal */
  metalness: number;
}

export interface AssetPart {
  id: string;
  name: string;
  shape: ShapeType;
  /**
   * Geometry parameters, interpreted per shape:
   * - box:       size = width / height / depth
   * - sphere:    size.x = radius (y,z ignored)
   * - cylinder:  size.x = radius, size.y = height
   * - cone:      size.x = radius, size.y = height
   * - plane:     size.x = width, size.y = height
   */
  size: Vec3;
  position: Vec3;
  /** Euler angles in radians */
  rotation: Vec3;
  scale: Vec3;
  material: PartMaterial;
  children: AssetPart[];
}

export type AssetCategory =
  | 'tree'
  | 'flower'
  | 'grass'
  | 'house'
  | 'rock'
  | 'road'
  | 'decor'
  | 'other';

export const ASSET_CATEGORIES: AssetCategory[] = [
  'tree',
  'flower',
  'grass',
  'house',
  'rock',
  'road',
  'decor',
  'other',
];

export interface AssetComponent {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  root: AssetPart;
  createdAt: string;
  updatedAt: string;
  /** data URL of a captured preview (optional) */
  thumbnail?: string;
}

/** Shape of the payload accepted when creating/updating an asset. */
export type AssetInput = Omit<AssetComponent, 'id' | 'createdAt' | 'updatedAt'>;

export function vec3(x = 0, y = 0, z = 0): Vec3 {
  return { x, y, z };
}

let idCounter = 0;
export function uid(prefix = 'part'): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

export function defaultMaterial(color = '#cccccc'): PartMaterial {
  return { color, roughness: 0.8, metalness: 0.05 };
}

export function createPart(opts: Partial<AssetPart> & { shape: ShapeType; name: string }): AssetPart {
  return {
    id: opts.id ?? uid(),
    name: opts.name,
    shape: opts.shape,
    size: opts.size ?? vec3(1, 1, 1),
    position: opts.position ?? vec3(),
    rotation: opts.rotation ?? vec3(),
    scale: opts.scale ?? vec3(1, 1, 1),
    material: opts.material ?? defaultMaterial(),
    children: opts.children ?? [],
  };
}

export function createEmptyAsset(name = 'Untitled', category: AssetCategory = 'other'): AssetComponent {
  const now = new Date().toISOString();
  return {
    id: uid('asset'),
    name,
    category,
    description: '',
    root: createPart({ shape: 'box', name: 'Root', material: defaultMaterial('#cccccc') }),
    createdAt: now,
    updatedAt: now,
  };
}

export * from './templates.ts';
