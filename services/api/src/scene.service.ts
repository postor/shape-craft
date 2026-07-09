import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Context } from 'moleculer';
import type { SceneComponent, SceneInput } from '@shape-craft/schema';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, '../data/scenes.json');

async function loadAll(): Promise<SceneComponent[]> {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SceneComponent[]) : [];
  } catch {
    return [];
  }
}

async function saveAll(items: SceneComponent[]): Promise<void> {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const sceneService = {
  name: 'scenes',

  actions: {
    list: {
      async handler(): Promise<SceneComponent[]> {
        return loadAll();
      },
    },

    get: {
      params: { id: 'string' },
      async handler(ctx: Context<{ id: string }>): Promise<SceneComponent> {
        const all = await loadAll();
        const found = all.find((s) => s.id === ctx.params.id);
        if (!found) throw new Error('Scene not found');
        return found;
      },
    },

    create: {
      params: {
        name: 'string',
        size: 'number',
        waterLevel: 'number',
        terrain: 'object',
        objects: 'array',
        thumbnail: { type: 'string', optional: true },
      },
      async handler(ctx: Context<SceneInput>): Promise<SceneComponent> {
        const all = await loadAll();
        const now = new Date().toISOString();
        const scene: SceneComponent = {
          id: uid('scene'),
          name: ctx.params.name,
          size: ctx.params.size,
          waterLevel: ctx.params.waterLevel,
          terrain: ctx.params.terrain,
          objects: ctx.params.objects ?? [],
          thumbnail: ctx.params.thumbnail,
          createdAt: now,
          updatedAt: now,
        };
        all.push(scene);
        await saveAll(all);
        return scene;
      },
    },

    update: {
      params: {
        id: 'string',
        name: { type: 'string', optional: true },
        size: { type: 'number', optional: true },
        waterLevel: { type: 'number', optional: true },
        terrain: { type: 'object', optional: true },
        objects: { type: 'array', optional: true },
        thumbnail: { type: 'string', optional: true },
      },
      async handler(ctx: Context<SceneInput & { id: string }>): Promise<SceneComponent> {
        const all = await loadAll();
        const idx = all.findIndex((s) => s.id === ctx.params.id);
        if (idx === -1) throw new Error('Scene not found');
        const prev = all[idx];
        const updated: SceneComponent = {
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
