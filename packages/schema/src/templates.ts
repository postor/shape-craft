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
  uid,
} from './index.ts';

export interface PrefabTemplate {
  key: AssetCategory | 'rock';
  label: string;
  build: () => AssetPart;
  defaultName: string;
}

export const PREFAB_TEMPLATES: PrefabTemplate[] = [];

export function templateByKey(key: string): PrefabTemplate | undefined {
  return PREFAB_TEMPLATES.find((t) => t.key === key);
}

export const _uid = uid;
