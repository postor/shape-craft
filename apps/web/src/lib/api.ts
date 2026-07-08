import type { AssetComponent, AssetInput } from '@shape-craft/schema';
import { clonePartTree, ensureUniquePartIds } from '@shape-craft/schema';

const LS_KEY = 'shapecraft.assets.v1';
const API_BASE = '/api/assets';

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify() {
  listeners.forEach((fn) => fn());
}

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
    if (!res.ok) {
      let message = res.statusText;
      try {
        const body = (await res.json()) as { message?: string };
        if (body?.message) message = body.message;
      } catch {
        /* ignore body parse errors */
      }
      throw new HttpError(message, res.status);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    return null; // network failure → caller falls back to localStorage
  }
}

function lsRead(): AssetComponent[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AssetComponent[]) : [];
  } catch {
    return [];
  }
}
function lsWrite(items: AssetComponent[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

// ---- Public API ----

export async function listAssets(): Promise<AssetComponent[]> {
  const remote = await apiFetch<AssetComponent[]>('');
  if (remote) return remote.map((a) => ({ ...a, root: ensureUniquePartIds(a.root) }));
  return lsRead().map((a) => ({ ...a, root: ensureUniquePartIds(a.root) }));
}

export async function getAsset(id: string): Promise<AssetComponent | null> {
  const remote = await apiFetch<AssetComponent>(`/${id}`);
  if (remote) return { ...remote, root: ensureUniquePartIds(remote.root) };
  const found = lsRead().find((a) => a.id === id) ?? null;
  return found ? { ...found, root: ensureUniquePartIds(found.root) } : null;
}

export async function createAsset(input: AssetInput): Promise<AssetComponent> {
  const res = await apiFetch<AssetComponent>('', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const now = new Date().toISOString();
  const asset: AssetComponent = {
    id: `asset_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  all.push(asset);
  lsWrite(all);
  notify();
  return asset;
}

export async function updateAsset(id: string, input: AssetInput): Promise<AssetComponent> {
  const res = await apiFetch<AssetComponent>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...input }),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('Asset not found');
  const updated: AssetComponent = {
    ...all[idx],
    ...input,
    id: all[idx].id,
    createdAt: all[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  lsWrite(all);
  notify();
  return updated;
}

export async function deleteAsset(id: string): Promise<void> {
  const res = await apiFetch<{ deleted: boolean }>(`/${id}`, { method: 'DELETE' });
  if (res && res.deleted) {
    notify();
    return;
  }
  const all = lsRead().filter((a) => a.id !== id);
  lsWrite(all);
  notify();
}

/** Create a copy of an existing asset with a fresh id and (Copy) suffix. */
export async function duplicateAsset(id: string): Promise<AssetComponent> {
  const src = await getAsset(id);
  if (!src) throw new Error('Asset not found');
  return createAsset({
    name: `${src.name} (Copy)`,
    category: src.category,
    description: src.description,
    root: clonePartTree(src.root),
    thumbnail: src.thumbnail,
  });
}

/** Rename an existing asset in place. */
export async function renameAsset(id: string, name: string): Promise<AssetComponent> {
  const src = await getAsset(id);
  if (!src) throw new Error('Asset not found');
  return updateAsset(id, { ...src, name });
}
