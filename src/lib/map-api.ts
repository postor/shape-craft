import type { MapComponent, MapInput } from '../schema';
import { ensureUniqueInstanceIds, normalizeMap } from '../schema';
import { isLocalMode } from './settings.ts';

export const LS_KEY = 'shapecraft.maps.v1';
const API_BASE = '/api/maps';

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeMaps(fn: Listener): () => void {
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
  if (isLocalMode()) return null;
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

function lsRead(): MapComponent[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as MapComponent[]) : [];
  } catch {
    return [];
  }
}
function lsWrite(items: MapComponent[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

function clean(map: MapComponent): MapComponent {
  return ensureUniqueInstanceIds(normalizeMap(map));
}

// ---- Public API ----

export async function listMaps(): Promise<MapComponent[]> {
  const remote = await apiFetch<MapComponent[]>('');
  if (remote) return remote.map(clean);
  return lsRead().map(clean);
}

export async function getMap(id: string): Promise<MapComponent | null> {
  const remote = await apiFetch<MapComponent>(`/${id}`);
  if (remote) return clean(remote);
  const found = lsRead().find((m) => m.id === id) ?? null;
  return found ? clean(found) : null;
}

export async function createMap(input: MapInput): Promise<MapComponent> {
  const res = await apiFetch<MapComponent>('', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const now = new Date().toISOString();
  const map: MapComponent = {
    id: `map_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  all.push(map);
  lsWrite(all);
  notify();
  return map;
}

export async function updateMap(id: string, input: MapInput): Promise<MapComponent> {
  const res = await apiFetch<MapComponent>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...input }),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error('Map not found');
  const updated: MapComponent = {
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

export async function deleteMap(id: string): Promise<void> {
  const res = await apiFetch<{ deleted: boolean }>(`/${id}`, { method: 'DELETE' });
  if (res && res.deleted) {
    notify();
    return;
  }
  const all = lsRead().filter((m) => m.id !== id);
  lsWrite(all);
  notify();
}

/** Create a copy of an existing map with a fresh id and (Copy) suffix. */
export async function duplicateMap(id: string): Promise<MapComponent> {
  const src = await getMap(id);
  if (!src) throw new Error('Map not found');
  return createMap({
    name: `${src.name} (Copy)`,
    description: src.description,
    size: src.size,
    terrain: src.terrain,
    water: src.water,
    instances: src.instances,
    thumbnail: src.thumbnail,
  });
}

/** Rename an existing map in place. */
export async function renameMap(id: string, name: string): Promise<MapComponent> {
  const src = await getMap(id);
  if (!src) throw new Error('Map not found');
  return updateMap(id, { ...src, name });
}

/** Notify all map subscribers (used after an external DB refresh, e.g. ZIP import). */
export function refreshMaps(): void {
  notify();
}
