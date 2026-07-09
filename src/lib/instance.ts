import { createPart, vec3, type AssetPart } from '../schema';
import { getAsset } from './api.ts';

export type RefMap = Map<string, AssetPart>;

/** Depth-first search for a part by id in a tree. Shared by every editor. */
export function findPart(node: AssetPart, id: string): AssetPart | null {
  if (node.id === id) return node;
  for (const c of node.children) {
    const f = findPart(c, id);
    if (f) return f;
  }
  return null;
}

/**
 * Build and attach an `instance` reference part to a part tree.
 *
 * This is the single shared implementation used by the asset editor, the
 * character editor and (conceptually) the scene editor so they don't each
 * re-implement the insertion. It:
 *  - resolves the parent: the selected part, or the tree root when nothing is
 *    selected (never nests under another locked `instance`);
 *  - fans repeated references out along +X/+Z so they don't overlap;
 *  - returns the created part so the caller can select/refresh it.
 */
export function buildInstanceReference(opts: {
  root: AssetPart;
  selectedId: string | null;
  refId: string;
  refName?: string;
}): AssetPart {
  const selected = opts.selectedId ? findPart(opts.root, opts.selectedId) : null;
  const parent = selected ?? opts.root;
  const target = parent.shape === 'instance' ? opts.root : parent;
  const instIndex = target.children.filter((c) => c.shape === 'instance').length;
  const inst = createPart({
    shape: 'instance',
    name: opts.refName ?? 'Instance',
    refId: opts.refId,
    position: vec3(0.9 + instIndex * 0.6, 0.2, 0.9),
  });
  target.children.push(inst);
  return inst;
}

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
      console.log('[ref] MISSING asset for refId=', refId);
      continue;
    }
    console.log('[ref] resolved refId=', refId, '-> root shape=', asset.root.shape, 'children=', asset.root.children.length);
    map.set(refId, asset.root);
    // Resolve any nested instances inside the referenced asset.
    await resolveRefs(asset.root, map);
  }
  console.log('[ref] resolveRefs done, map size=', map.size);
  return map;
}
