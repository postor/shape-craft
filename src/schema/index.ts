/**
 * Shared domain schema for ShapeCraft.
 *
 * These types describe an "Asset Component" (元件) — a reusable 3D prefab built
 * from primitive shapes + materials. They are shared by the frontend editor
 * and the backend asset service so the wire format stays stable.
 */

import type { AnimClip } from './character.ts';

export type ShapeType =
  | 'box'
  | 'sphere'
  | 'cylinder'
  | 'cone'
  | 'plane'
  | 'triangle'
  | 'node'
  | 'instance';

/**
 * Shapes that carry their own visible geometry (i.e. can produce a mesh).
 * `node` is a pure transform container and `instance` is a reference to another
 * asset's subtree — both render no geometry of their own.
 */
export const MESH_SHAPES: ShapeType[] = [
  'box',
  'sphere',
  'cylinder',
  'cone',
  'plane',
  'triangle',
];

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
  /**
   * Opacity 0..1 (additive). When < 1 the part renders as a transparent mesh.
   * Defaults to 1 (opaque). Used for glass / water / waterfall sheets.
   */
  opacity?: number;
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
  /**
   * For `shape === 'instance'`: the id of the referenced AssetComponent whose
   * subtree is rendered (read-only, as a single locked unit) wherever this part
   * is placed. Internal details cannot be edited through the instance — change
   * the original asset instead. Omit for every other shape. Additive field.
   */
  refId?: string;
}

export type AssetCategory =
  | 'tree'
  | 'flower'
  | 'grass'
  | 'house'
  | 'rock'
  | 'road'
  | 'decor'
  | 'character'
  | 'waterfall'
  | 'other';

export const ASSET_CATEGORIES: AssetCategory[] = [
  'tree',
  'flower',
  'grass',
  'house',
  'rock',
  'road',
  'decor',
  'character',
  'waterfall',
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
  /** Character rig kind when the asset is a character (optional, additive). */
  characterType?: 'humanoid' | 'quadruped' | 'flying';
  /**
   * Editable "script slots" (animation clips) authored in the character editor.
   * When present these override the built-in {@link CHARACTER_CLIPS} presets for
   * this asset, so custom animations persist with the component. Optional and
   * additive — older assets without it keep using the presets.
   */
  animClips?: AnimClip[];
  /**
   * Custom script slots. Each slot binds a Unity-style `update(t, dt)` script to
   * a part (by id); the runtime calls it every frame while the asset is previewed.
   * `self` is the part's Object3D, `scene` is the asset root, `THREE` is the
   * three.js namespace. Optional and additive — assets without it stay static.
   */
  scripts?: ScriptSlot[];
}

/**
 * A custom script slot. The engine compiles `code` once (a Unity-style
 * `update(t, dt)` function, optionally a `start()` initializer) and invokes it
 * every frame for the part identified by `partId`.
 */
export interface ScriptSlot {
  id: string;
  /** Id of the part this script is attached to. */
  partId: string;
  name: string;
  /** Source code. Define `function update(t, dt) {}` (and optionally `start() {}`). */
  code: string;
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

export function defaultMaterial(color = '#cccccc', opacity = 1): PartMaterial {
  return { color, roughness: 0.8, metalness: 0.05, ...(opacity < 1 ? { opacity } : {}) };
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
    refId: opts.refId,
    children: opts.children ?? [],
  };
}

/** Deep-clone a part tree, assigning fresh ids to every node. */
export function clonePartTree(part: AssetPart): AssetPart {
  return {
    ...part,
    id: uid(),
    material: { ...part.material },
    size: { ...part.size },
    position: { ...part.position },
    rotation: { ...part.rotation },
    scale: { ...part.scale },
    children: part.children.map(clonePartTree),
  };
}

/**
 * Walk a part tree and guarantee every node has a globally unique id.
 *
 * If two or more nodes share the same id (the bug behind "selecting one part
 * highlights several"), the first occurrence keeps its id and every later
 * collision is reassigned a fresh `uid()`. Returns the (possibly remapped) root.
 * The original id is preserved wherever possible to minimize churn.
 */
export function ensureUniquePartIds(root: AssetPart): AssetPart {
  const seen = new Set<string>();
  const walk = (part: AssetPart): AssetPart => {
    let id = part.id;
    if (!id || seen.has(id)) {
      id = uid();
    }
    seen.add(id);
    return { ...part, id, children: part.children.map(walk) };
  };
  return walk(root);
}

export function createEmptyAsset(name = 'Untitled', category: AssetCategory = 'other'): AssetComponent {
  const now = new Date().toISOString();
  return {
    id: uid('asset'),
    name,
    category,
    description: '',
    root: createPart({ shape: 'node', name: 'Root', material: defaultMaterial('#cccccc') }),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Migrate a legacy asset whose root was an empty `box` (the old default for a
 * freshly created 元件) to a `node` container. Assets whose root is a real
 * primitive (it has children, or was renamed) are left untouched.
 */
export function migrateEmptyBoxRoot(asset: AssetComponent): AssetComponent {
  const root = asset.root;
  if (root.shape === 'box' && root.name === 'Root' && root.children.length === 0) {
    return {
      ...asset,
      root: { ...root, shape: 'node' },
    };
  }
  return asset;
}

// ---------------------------------------------------------------------------
// Bounding box / centering / grounding
//
// Prefabs and characters are generated so that their geometric center sits at
// the local origin (0,0,0). That keeps their pivot centered, so when an asset
// is referenced elsewhere (as an instance, or placed on terrain) it rotates
// and scales around its middle. Rotation is ignored for the AABB (a cheap
// approximation that is fine for our low-poly, mostly-upright models).
// ---------------------------------------------------------------------------

export interface AABB {
  min: Vec3;
  max: Vec3;
}

/** Local-space half-extents of a single mesh shape, centered at the origin. */
function shapeHalfExtents(shape: ShapeType, size: Vec3): Vec3 {
  switch (shape) {
    case 'box':
      return vec3(size.x / 2, size.y / 2, size.z / 2);
    case 'sphere':
      return vec3(size.x, size.x, size.x);
    case 'cylinder':
      return vec3(size.x, size.y / 2, size.x);
    case 'cone':
      return vec3(size.x, size.y / 2, size.x);
    case 'plane':
      return vec3(size.x / 2, size.y / 2, 0.0001);
    case 'triangle':
      // Base at y=0, apex at y=size.y.
      return vec3(size.x / 2, size.y / 2, 0.0001);
    default:
      // node / instance: no geometry of their own.
      return vec3(0, 0, 0);
  }
}

/**
 * Walk the part tree and accumulate the world-space AABB of every mesh.
 * `parent` is the accumulated transform (position + scale) of the parent holder.
 */
function accumulateAABB(part: AssetPart, parentPos: Vec3, parentScale: Vec3, box: AABB): void {
  const scale = vec3(
    parentScale.x * part.scale.x,
    parentScale.y * part.scale.y,
    parentScale.z * part.scale.z,
  );
  const pos = vec3(
    parentPos.x + part.position.x * parentScale.x,
    parentPos.y + part.position.y * parentScale.y,
    parentPos.z + part.position.z * parentScale.z,
  );

  const half = shapeHalfExtents(part.shape, part.size);
  box.min.x = Math.min(box.min.x, pos.x - half.x * scale.x);
  box.min.y = Math.min(box.min.y, pos.y - half.y * scale.y);
  box.min.z = Math.min(box.min.z, pos.z - half.z * scale.z);
  box.max.x = Math.max(box.max.x, pos.x + half.x * scale.x);
  box.max.y = Math.max(box.max.y, pos.y + half.y * scale.y);
  box.max.z = Math.max(box.max.z, pos.z + half.z * scale.z);

  for (const c of part.children) accumulateAABB(c, pos, scale, box);
}

/** World-space AABB of all mesh geometry in a part tree. */
export function computeAABB(root: AssetPart): AABB {
  const box: AABB = {
    min: vec3(Infinity, Infinity, Infinity),
    max: vec3(-Infinity, -Infinity, -Infinity),
  };
  accumulateAABB(root, vec3(), vec3(1, 1, 1), box);
  if (!isFinite(box.min.x)) {
    // No mesh geometry (e.g. an empty node) — collapse to the origin.
    return { min: vec3(), max: vec3() };
  }
  return box;
}

/**
 * Shift the root so the geometry's bounding-box center lands on the local
 * origin (0,0,0). Mutates and returns `root`. Apply this to every freshly
 * generated prefab / character so assets are centered by construction.
 */
export function recenterPartTree(root: AssetPart): AssetPart {
  const box = computeAABB(root);
  const cx = (box.min.x + box.max.x) / 2;
  const cy = (box.min.y + box.max.y) / 2;
  const cz = (box.min.z + box.max.z) / 2;
  root.position = vec3(root.position.x - cx, root.position.y - cy, root.position.z - cz);
  return root;
}

/**
 * When an asset is placed on a ground plane (terrain / floor) it should rest on
 * y=0 rather than be half-buried. Because generation centers the geometry at
 * the origin, the needed upward shift is simply the top half-height. Multiply by
 * the placement scale's Y if the instance is scaled.
 */
export function groundOffsetY(root: AssetPart): number {
  const box = computeAABB(root);
  return (box.max.y - box.min.y) / 2;
}

export * from './templates.ts';
export * from './character.ts';
export * from './scene.ts';
export * from './animation.ts';
export * from './map.ts';
export * from './prefabs.ts';
export * from './record.ts';
