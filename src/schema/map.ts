/**
 * Shared domain schema for ShapeCraft maps.
 *
 * A `MapComponent` (地图) is a square-area 3D scene: a terrain heightfield, an
 * optional water plane, and a list of placed asset instances (references to
 * existing AssetComponents). Maps are edited in a dedicated map editor that
 * mirrors the asset/component editor. The map types are new and do not alter
 * the existing AssetComponent / AssetPart wire contract.
 */

import type { Vec3 } from './index.ts';
import { uid, vec3 } from './index.ts';

export interface MapTerrain {
  /** number of grid segments per side; vertex count = (segments + 1)^2 */
  segments: number;
  /** height per vertex, row-major, length (segments + 1)^2 */
  heights: number[];
}

export interface MapWater {
  enabled: boolean;
  /** water plane height (world Y) */
  level: number;
  /** hex color */
  color: string;
}

/** A placed reference to an existing AssetComponent within the map. */
export interface MapInstance {
  id: string;
  /** id of the referenced AssetComponent */
  assetId: string;
  name?: string;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
}

export interface MapComponent {
  id: string;
  name: string;
  description: string;
  /** square area side length in world units */
  size: number;
  terrain: MapTerrain;
  water: MapWater;
  instances: MapInstance[];
  createdAt: string;
  updatedAt: string;
  /** data URL of a captured preview (optional) */
  thumbnail?: string;
}

/** Payload accepted when creating/updating a map. */
export type MapInput = Omit<MapComponent, 'id' | 'createdAt' | 'updatedAt'>;

export function defaultTerrain(segments = 16): MapTerrain {
  const n = (segments + 1) * (segments + 1);
  return { segments, heights: new Array(n).fill(0) };
}

export function createMapInstance(
  assetId: string,
  position: Vec3 = vec3(),
  rotation: Vec3 = vec3(),
  scale: Vec3 = vec3(1, 1, 1),
  name?: string,
): MapInstance {
  return { id: uid('mi'), assetId, name, position, rotation, scale };
}

export function createEmptyMap(name = 'Untitled Map', segments = 16, size = 20): MapComponent {
  const now = new Date().toISOString();
  return {
    id: uid('map'),
    name,
    description: '',
    size,
    terrain: defaultTerrain(segments),
    water: { enabled: true, level: 0.5, color: '#3a7bd5' },
    instances: [],
    createdAt: now,
    updatedAt: now,
  };
}

const coerceVec = (v: unknown): Vec3 =>
  vec3(Number((v as Vec3)?.x) || 0, Number((v as Vec3)?.y) || 0, Number((v as Vec3)?.z) || 0);

/**
 * Normalize a map so its terrain / water / instances have correct shapes and
 * lengths. Used on load (service + web) so legacy or hand-edited data never
 * crashes the editor. Missing instance ids are regenerated.
 */
export function normalizeMap(m: MapComponent): MapComponent {
  const seg = Math.max(1, Math.floor(Number(m.terrain?.segments) || 16));
  const expected = (seg + 1) * (seg + 1);
  const raw = Array.isArray(m.terrain?.heights) ? m.terrain!.heights : [];
  const heights: number[] = new Array(expected).fill(0);
  for (let i = 0; i < expected; i++) heights[i] = Number(raw[i]) || 0;

  const water: MapWater = {
    enabled: m.water?.enabled !== false,
    level: Number(m.water?.level) || 0,
    color: typeof m.water?.color === 'string' ? m.water!.color : '#3a7bd5',
  };

  const instances: MapInstance[] = (Array.isArray(m.instances) ? m.instances : []).map((inst) => ({
    id: inst?.id ?? uid('mi'),
    assetId: String(inst?.assetId ?? ''),
    name: inst?.name,
    position: coerceVec(inst?.position),
    rotation: coerceVec(inst?.rotation),
    scale: inst?.scale ? coerceVec(inst.scale) : vec3(1, 1, 1),
  }));

  return {
    id: m.id,
    name: m.name ?? 'Untitled Map',
    description: m.description ?? '',
    size: Number(m.size) || 20,
    terrain: { segments: seg, heights },
    water,
    instances,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    thumbnail: m.thumbnail,
  };
}

/** Guarantee every placed instance has a globally unique id. */
export function ensureUniqueInstanceIds(map: MapComponent): MapComponent {
  const seen = new Set<string>();
  const walk = (inst: MapInstance): MapInstance => {
    let id = inst.id;
    if (!id || seen.has(id)) id = uid('mi');
    seen.add(id);
    return { ...inst, id };
  };
  return { ...map, instances: map.instances.map(walk) };
}

export interface MapTemplate {
  key: string;
  label: string;
  defaultName: string;
  build: () => { size: number; terrain: MapTerrain; water: MapWater };
}

function hillyTerrain(segments = 16): MapTerrain {
  const n = (segments + 1) * (segments + 1);
  const heights = new Array<number>(n);
  for (let j = 0; j <= segments; j++) {
    for (let i = 0; i <= segments; i++) {
      const x = i / segments;
      const z = j / segments;
      heights[j * (segments + 1) + i] = Math.sin(x * Math.PI * 2) * 0.6 + Math.cos(z * Math.PI * 2) * 0.6;
    }
  }
  return { segments, heights };
}

export const MAP_TEMPLATES: MapTemplate[] = [
  {
    key: 'flat',
    label: 'Flat 平原',
    defaultName: 'Flat Map',
    build: () => ({ size: 20, terrain: defaultTerrain(16), water: { enabled: true, level: 0.5, color: '#3a7bd5' } }),
  },
  {
    key: 'hilly',
    label: 'Hilly 丘陵',
    defaultName: 'Hilly Map',
    build: () => ({ size: 20, terrain: hillyTerrain(16), water: { enabled: true, level: 0.2, color: '#3a7bd5' } }),
  },
];

export function mapTemplateByKey(key: string): MapTemplate | undefined {
  return MAP_TEMPLATES.find((t) => t.key === key);
}

/** Build a fresh map from a template key (or an empty map when unknown). */
export function createMapFromTemplate(key: string, name?: string): MapComponent {
  const tpl = mapTemplateByKey(key);
  const base = tpl
    ? tpl.build()
    : { size: 20, terrain: defaultTerrain(16), water: { enabled: true, level: 0.5, color: '#3a7bd5' } };
  const now = new Date().toISOString();
  return {
    id: uid('map'),
    name: name ?? (tpl?.defaultName ?? 'Untitled Map'),
    description: '',
    ...base,
    instances: [],
    createdAt: now,
    updatedAt: now,
  };
}
