import type { AnimComponent, AnimInput } from '@shape-craft/schema';

const LS_KEY = 'shapecraft.animations.v1';
const API_BASE = '/api/animations';

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeAnimations(fn: Listener): () => void {
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

function lsRead(): AnimComponent[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AnimComponent[]) : [];
  } catch {
    return [];
  }
}
function lsWrite(items: AnimComponent[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

// ---- Public API ----

export async function listAnimations(): Promise<AnimComponent[]> {
  const remote = await apiFetch<AnimComponent[]>('');
  if (remote) return remote;
  return lsRead();
}

export async function listAnimationsByScene(sceneId: string): Promise<AnimComponent[]> {
  const remote = await apiFetch<AnimComponent[]>(`/scene/${sceneId}`);
  if (remote) return remote;
  return lsRead().filter((a) => a.sceneId === sceneId);
}

export async function getAnimation(id: string): Promise<AnimComponent | null> {
  const remote = await apiFetch<AnimComponent>(`/${id}`);
  if (remote) return remote;
  return lsRead().find((s) => s.id === id) ?? null;
}

export async function createAnimation(input: AnimInput): Promise<AnimComponent> {
  const res = await apiFetch<AnimComponent>('', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const now = new Date().toISOString();
  const anim: AnimComponent = {
    id: `anim_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  all.push(anim);
  lsWrite(all);
  notify();
  return anim;
}

export async function updateAnimation(id: string, input: AnimInput): Promise<AnimComponent> {
  const res = await apiFetch<AnimComponent>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...input }),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Animation not found');
  const updated: AnimComponent = {
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

export async function deleteAnimation(id: string): Promise<void> {
  const res = await apiFetch<{ deleted: boolean }>(`/${id}`, { method: 'DELETE' });
  if (res && res.deleted) {
    notify();
    return;
  }
  const all = lsRead().filter((s) => s.id !== id);
  lsWrite(all);
  notify();
}
