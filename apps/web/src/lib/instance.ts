import type { AssetPart } from '@shape-craft/schema';
import { getAsset } from './api.ts';

export type RefMap = Map<string, AssetPart>;

/** Collect every `instance` part in a tree (deep, no resolver needed here). */
function collectInstances(part: AssetPart, out: AssetPart[] = []): AssetPart[] {
  if (part.shape === 'instance') out.push(part);
  for (const c of part.children) collectInstances(c, out);
  return out;
}

/**
 * Walk a part tree and resolve every `instance` reference into a map of
 * `refId -> referenced AssetPart root`. Resolution is recursive, so an asset
 * that itself contains instances is fully expanded. Assets already in the map
 * (or known to be missing) are skipped to avoid redundant network calls.
 */
export async function resolveRefs(root: AssetPart, map: RefMap = new Map()): Promise<RefMap> {
  const missing = new Set<string>();
  const pending = collectInstances(root);
  for (const inst of pending) {
    const refId = inst.refId;
    if (!refId || map.has(refId) || missing.has(refId)) continue;
    const asset = await getAsset(refId);
    if (!asset) {
      missing.add(refId);
      continue;
    }
    map.set(refId, asset.root);
    // Resolve any nested instances inside the referenced asset.
    await resolveRefs(asset.root, map);
  }
  return map;
}
