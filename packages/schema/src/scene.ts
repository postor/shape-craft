/**
 * Scene domain schema for ShapeCraft.
 *
 * A Scene (场景 / 区域) is a square plot of land that holds editable terrain
 * (a heightmap) plus a set of placed objects (each referencing an AssetComponent
 * from the library). Scenes are shared by the frontend scene editor and the
 * backend scene service so the wire format stays stable.
 */

import type { Vec3 } from './index.ts';
import { vec3 } from './index.ts';

/** Grid resolution helper: a terrain of `segments` has (segments+1)^2 vertices. */
export const DEFAULT_SCENE_SIZE = 24;
export const DEFAULT_TERRAIN_SEGMENTS = 48;

/**
 * Editable terrain stored as a flat heightmap. `heights` is row-major with
 * `segments + 1` entries per side, length `(segments+1)^2`. Vertex (i, j) maps
 * to world XZ:
 *   x = -size/2 + (i/segments) * size
 *   z = -size/2 + (j/segments) * size
 *   y = heights[j*(segments+1) + i]
 */
export interface TerrainData {
  /** Full side length of the square region. */
  size: number;
  /** Grid divisions per side (vertices per side = segments + 1). */
  segments: number;
  /** Flat array of vertex heights, length (segments+1)^2. */
  heights: number[];
  /** Base terrain color (hex). */
  color: string;
}

export interface SceneObject {
  id: string;
  /** Id of the AssetComponent placed here. */
  assetId: string;
  name: string;
  position: Vec3;
  /** Euler angles in radians. */
  rotation: Vec3;
  scale: Vec3;
}

export interface SceneComponent {
  id: string;
  name: string;
  /** Side length of the square region (mirrors terrain.size for convenience). */
  size: number;
  /** Water plane height; objects/terrain below this sit underwater. */
  waterLevel: number;
  terrain: TerrainData;
  objects: SceneObject[];
  createdAt: string;
  updatedAt: string;
  /** data URL of a captured preview (optional). */
  thumbnail?: string;
}

/** Payload accepted when creating/updating a scene. */
export type SceneInput = Omit<SceneComponent, 'id' | 'createdAt' | 'updatedAt'>;

let idCounter = 0;
function sceneUid(prefix = 'scene'): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

/** Number of vertices per side for a given segment count. */
export function terrainSide(segments: number): number {
  return segments + 1;
}

/** Total vertex count for a terrain. */
export function terrainVertexCount(segments: number): number {
  const s = terrainSide(segments);
  return s * s;
}

export function createFlatTerrain(
  size = DEFAULT_SCENE_SIZE,
  segments = DEFAULT_TERRAIN_SEGMENTS,
  color = '#6b8e3d',
): TerrainData {
  const count = terrainVertexCount(segments);
  return { size, segments, heights: new Array(count).fill(0), color };
}

export function createSceneObject(assetId: string, name: string): SceneObject {
  return {
    id: sceneUid('obj'),
    assetId,
    name,
    position: vec3(0, 0, 0),
    rotation: vec3(),
    scale: vec3(1, 1, 1),
  };
}

export function createEmptyScene(name = 'Untitled Scene'): SceneComponent {
  const now = new Date().toISOString();
  const terrain = createFlatTerrain();
  return {
    id: sceneUid('scene'),
    name,
    size: terrain.size,
    waterLevel: -2,
    terrain,
    objects: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Sample the terrain height at a world (x, z) via bilinear interpolation.
 * Returns 0 when the point is outside the region (callers usually clamp first).
 */
export function sampleTerrainHeight(terrain: TerrainData, x: number, z: number): number {
  const { size, segments, heights } = terrain;
  const side = terrainSide(segments);
  const fx = ((x + size / 2) / size) * segments;
  const fz = ((z + size / 2) / size) * segments;
  if (fx < 0 || fz < 0 || fx > segments || fz > segments) return 0;
  const i0 = Math.min(Math.floor(fx), segments);
  const j0 = Math.min(Math.floor(fz), segments);
  const i1 = Math.min(i0 + 1, segments);
  const j1 = Math.min(j0 + 1, segments);
  const tx = fx - i0;
  const tz = fz - j0;
  const h00 = heights[j0 * side + i0];
  const h10 = heights[j0 * side + i1];
  const h01 = heights[j1 * side + i0];
  const h11 = heights[j1 * side + i1];
  const top = h00 + (h10 - h00) * tx;
  const bot = h01 + (h11 - h01) * tx;
  return top + (bot - top) * tz;
}
