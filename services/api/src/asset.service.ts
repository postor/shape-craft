import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Context } from 'moleculer';
import type { AssetComponent, AssetInput } from '@shape-craft/schema';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, '../data/assets.json');

async function loadAll(): Promise<AssetComponent[]> {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AssetComponent[]) : [];
  } catch {
    return [];
  }
}

async function saveAll(items: AssetComponent[]): Promise<void> {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const assetService = {
  name: 'assets',

  actions: {
    list: {
      handler(): Promise<AssetComponent[]> {
        return loadAll();
      },
    },

    get: {
      params: { id: 'string' },
      async handler(ctx: Context<{ id: string }>): Promise<AssetComponent> {
        const all = await loadAll();
        const found = all.find((a) => a.id === ctx.params.id);
        if (!found) throw new Error('Asset not found');
        return found;
      },
    },

    create: {
      params: {
        name: 'string',
        category: 'string',
        description: 'string',
        root: 'object',
        thumbnail: { type: 'string', optional: true },
      },
      async handler(ctx: Context<AssetInput>): Promise<AssetComponent> {
        const all = await loadAll();
        const now = new Date().toISOString();
        const asset: AssetComponent = {
          id: uid('asset'),
          name: ctx.params.name,
          category: ctx.params.category as AssetComponent['category'],
          description: ctx.params.description ?? '',
          root: ctx.params.root,
          thumbnail: ctx.params.thumbnail,
          createdAt: now,
          updatedAt: now,
        };
        all.push(asset);
        await saveAll(all);
        return asset;
      },
    },

    update: {
      params: {
        id: 'string',
        name: { type: 'string', optional: true },
        category: { type: 'string', optional: true },
        description: { type: 'string', optional: true },
        root: { type: 'object', optional: true },
        thumbnail: { type: 'string', optional: true },
      },
      async handler(ctx: Context<AssetInput & { id: string }>): Promise<AssetComponent> {
        const all = await loadAll();
        const idx = all.findIndex((a) => a.id === ctx.params.id);
        if (idx === -1) throw new Error('Asset not found');
        const prev = all[idx];
        const updated: AssetComponent = {
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
        const next = all.filter((a) => a.id !== ctx.params.id);
        const deleted = next.length !== all.length;
        await saveAll(next);
        return { id: ctx.params.id, deleted };
      },
    },
  },
};
