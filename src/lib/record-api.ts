import type { RecordSession, RecordInput } from '../schema';
import { isLocalMode } from './settings.ts';

export const LS_KEY = 'shapecraft.records.v1';
const API_BASE = '/api/records';

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeRecords(fn: Listener): () => void {
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
        /* ignore */
      }
      throw new HttpError(message, res.status);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    return null;
  }
}

function lsRead(): RecordSession[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as RecordSession[]) : [];
  } catch {
    return [];
  }
}
function lsWrite(items: RecordSession[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export async function listRecords(): Promise<RecordSession[]> {
  const remote = await apiFetch<RecordSession[]>('');
  if (remote) return remote;
  return lsRead().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getRecord(id: string): Promise<RecordSession | null> {
  const remote = await apiFetch<RecordSession>(`/${id}`);
  if (remote) return remote;
  return lsRead().find((s) => s.id === id) ?? null;
}

export async function createRecord(input: RecordInput): Promise<RecordSession> {
  const res = await apiFetch<RecordSession>('', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const now = new Date().toISOString();
  const rec: RecordSession = {
    id: `rec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  all.push(rec);
  lsWrite(all);
  notify();
  return rec;
}

export async function updateRecord(id: string, input: RecordInput): Promise<RecordSession> {
  const res = await apiFetch<RecordSession>(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...input }),
  });
  if (res) {
    notify();
    return res;
  }
  const all = lsRead();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Record session not found');
  const updated: RecordSession = {
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

export async function deleteRecord(id: string): Promise<void> {
  const res = await apiFetch<{ deleted: boolean }>(`/${id}`, { method: 'DELETE' });
  if (res && res.deleted) {
    notify();
    return;
  }
  const all = lsRead().filter((s) => s.id !== id);
  lsWrite(all);
  notify();
}

export function refreshRecords(): void {
  notify();
}
