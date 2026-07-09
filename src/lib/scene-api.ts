import type { SceneComponent, SceneInput } from '../schema';
import { isLocalMode } from './settings.ts';

export const LS_KEY = 'shapecraft.scenes.v1';
const API_BASE = '/api/scenes';

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeScenes(fn: Listener): () => void {
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

function lsRead(): SceneComponent[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SceneComponent[]) : [];
  } catch {
    return [];
  }
}
function lsWrite(items: SceneComponent[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

// ---- Public API ----

export async function listScenes(): Promise<SceneComponent[]> {
  const remote = await apiFetch<SceneComponent[]>('');
  if (remote) return remote;
  return lsRead();
}

export async function getScene(id: string): Promise<SceneComponent | null> {
  const remote = await apiFetch<SceneComponent>(`/${id}`);
  if (remote) return remote;
  return lsRead().find((s) => s.id === id) ?? null;
}

export async function createScene(input: SceneInput): Promise<SceneComponent> {
  const res = await apiFetch<SceneComponent>('', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const now = new Date().toISOString();
  const scene: SceneComponent = {
    id: `scene_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  all.push(scene);
  lsWrite(all);
  notify();
  return scene;
}

export async function updateScene(id: string, input: SceneInput): Promise<SceneComponent> {
  const res = await apiFetch<SceneComponent>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...input }),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Scene not found');
  const updated: SceneComponent = {
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

export async function deleteScene(id: string): Promise<void> {
  const res = await apiFetch<{ deleted: boolean }>(`/${id}`, { method: 'DELETE' });
  if (res && res.deleted) {
    notify();
    return;
  }
  const all = lsRead().filter((s) => s.id !== id);
  lsWrite(all);
  notify();
}

/** Notify all scene subscribers (used after an external DB refresh, e.g. ZIP import). */
export function refreshScenes(): void {
  notify();
}
