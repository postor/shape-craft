import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Context } from 'moleculer';
import type { AnimComponent, AnimInput } from '@shape-craft/schema';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, '../data/animations.json');

async function loadAll(): Promise<AnimComponent[]> {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AnimComponent[]) : [];
  } catch {
    return [];
  }
}

async function saveAll(items: AnimComponent[]): Promise<void> {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const animationService = {
  name: 'animations',

  actions: {
    list: {
      async handler(): Promise<AnimComponent[]> {
        return loadAll();
      },
    },

    /** List only animations bound to a given scene. */
    listByScene: {
      params: { sceneId: 'string' },
      async handler(ctx: Context<{ sceneId: string }>): Promise<AnimComponent[]> {
        const all = await loadAll();
        return all.filter((a) => a.sceneId === ctx.params.sceneId);
      },
    },

    get: {
      params: { id: 'string' },
      async handler(ctx: Context<{ id: string }>): Promise<AnimComponent> {
        const all = await loadAll();
        const found = all.find((s) => s.id === ctx.params.id);
        if (!found) throw new Error('Animation not found');
        return found;
      },
    },

    create: {
      params: {
        name: 'string',
        sceneId: 'string',
        duration: 'number',
        tracks: 'array',
        thumbnail: { type: 'string', optional: true },
      },
      async handler(ctx: Context<AnimInput>): Promise<AnimComponent> {
        const all = await loadAll();
        const now = new Date().toISOString();
        const anim: AnimComponent = {
          id: uid('anim'),
          name: ctx.params.name,
          sceneId: ctx.params.sceneId,
          duration: ctx.params.duration ?? 8,
          tracks: ctx.params.tracks ?? [],
          thumbnail: ctx.params.thumbnail,
          createdAt: now,
          updatedAt: now,
        };
        all.push(anim);
        await saveAll(all);
        return anim;
      },
    },

    update: {
      params: {
        id: 'string',
        name: { type: 'string', optional: true },
        sceneId: { type: 'string', optional: true },
        duration: { type: 'number', optional: true },
        tracks: { type: 'array', optional: true },
        thumbnail: { type: 'string', optional: true },
      },
      async handler(ctx: Context<AnimInput & { id: string }>): Promise<AnimComponent> {
        const all = await loadAll();
        const idx = all.findIndex((s) => s.id === ctx.params.id);
        if (idx === -1) throw new Error('Animation not found');
        const prev = all[idx];
        const updated: AnimComponent = {
          ...prev,
          ...ctx.params,
          id: prev.id,
          createdAt: prev.createdAt,
          updatedAt: new Date().toISOString(),
        };
        all[idx] = updated;
        await saveAll(all);
        return updated;
      },
    },

    remove: {
      params: { id: 'string' },
      async handler(ctx: Context<{ id: string }>): Promise<{ id: string; deleted: boolean }> {
        const all = await loadAll();
        const next = all.filter((s) => s.id !== ctx.params.id);
        const deleted = next.length !== all.length;
        await saveAll(next);
        return { id: ctx.params.id, deleted };
      },
    },
  },
};
