/**
 * Local database I/O — the single place that knows how to snapshot and restore
 * the *entire* ShapeCraft database to/from a ZIP file.
 *
 * "The database" is the union of every collection the app persists in
 * `localStorage` (assets, scenes, animations, maps) plus the user settings.
 * Exported archives are also shaped like the backend's `services/api/data`
 * folder (same filenames), so an export can be unzipped there to seed a server.
 *
 * Everything here operates purely on `localStorage` and the dependency-free
 * `zip.ts` reader/writer, so the app needs no backend server to back up,
 * transfer, or restore its data.
 */

import {
  LS_KEY as ASSETS_LS_KEY,
  refreshAssets,
} from './api.ts';
import {
  LS_KEY as SCENES_LS_KEY,
  refreshScenes,
} from './scene-api.ts';
import {
  LS_KEY as ANIMATIONS_LS_KEY,
  refreshAnimations,
} from './anim-api.ts';
import {
  LS_KEY as MAPS_LS_KEY,
  refreshMaps,
} from './map-api.ts';
import { SETTINGS_KEY, isLocalMode, setLocalMode } from './settings.ts';
import { createZip, extractZip } from './zip.ts';

interface DbCollection {
  /** localStorage key holding the JSON array for this collection. */
  lsKey: string;
  /** Filename used both inside the ZIP and in the backend data folder. */
  file: string;
}

/** Every collection that is part of "the database", in archive order. */
const COLLECTIONS: DbCollection[] = [
  { lsKey: ASSETS_LS_KEY, file: 'assets.json' },
  { lsKey: SCENES_LS_KEY, file: 'scenes.json' },
  { lsKey: MAPS_LS_KEY, file: 'maps.json' },
  { lsKey: ANIMATIONS_LS_KEY, file: 'animations.json' },
];

const META_FILE = 'meta.json';
const SETTINGS_FILE = 'settings.json';

function readText(lsKey: string): string {
  try {
    return localStorage.getItem(lsKey) ?? '';
  } catch {
    return '';
  }
}

/**
 * Build a ZIP snapshot of the entire database.
 *
 * Each collection is stored as a JSON array under its canonical filename, plus
 * `settings.json` (user AI/provider config) and `meta.json` (app marker +
 * export timestamp + whether local mode was on). Returns a downloadable Blob.
 */
export async function exportDatabase(): Promise<Blob> {
  const files = COLLECTIONS.map((c) => ({
    name: c.file,
    data: new TextEncoder().encode(readText(c.lsKey) || '[]'),
  }));

  files.push({
    name: SETTINGS_FILE,
    data: new TextEncoder().encode(readText(SETTINGS_KEY) || '{}'),
  });

  files.push({
    name: META_FILE,
    data: new TextEncoder().encode(
      JSON.stringify({
        app: 'ShapeCraft',
        format: 1,
        exportedAt: new Date().toISOString(),
        localMode: isLocalMode(),
        collections: COLLECTIONS.map((c) => c.file),
      }),
    ),
  });

  return createZip(files);
}

export interface ImportResult {
  /** Files that were successfully read and applied. */
  imported: string[];
  /** Expected files that were missing from the archive (non-fatal). */
  skipped: string[];
  /** Hard failures (e.g. a collection file was not valid JSON). */
  errors: string[];
}

/**
 * Read a ZIP snapshot and replace the entire local database with its contents.
 *
 * Every known collection file is overwritten; `settings.json` (if present) is
 * restored too. Unknown/extra files are ignored. After writing, all subscribers
 * are notified so open views refresh. Returns a summary of what happened.
 *
 * Note: collections are written as raw JSON — the per-collection read paths in
 * the various `*-api.ts` modules still apply their own migrations/normalization
 * (e.g. `migrateEmptyBoxRoot`, `ensureUniquePartIds`) on the next read.
 */
export async function importDatabase(blob: Blob): Promise<ImportResult> {
  const entries = await extractZip(blob);
  const byName = new Map(entries.map((e) => [e.name, e]));

  const result: ImportResult = { imported: [], skipped: [], errors: [] };

  for (const c of COLLECTIONS) {
    const entry = byName.get(c.file);
    if (!entry) {
      result.skipped.push(c.file);
      continue;
    }
    const text = new TextDecoder().decode(entry.data);
    try {
      // Validate JSON *and* shape: each collection must be an array, otherwise
      // writing it would corrupt the collection (the read paths assume an array
      // and would throw / lose all data on the next read).
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('collection must be a JSON array');
      localStorage.setItem(c.lsKey, text);
      result.imported.push(c.file);
    } catch {
      result.errors.push(c.file);
    }
  }

  const settingsEntry = byName.get(SETTINGS_FILE);
  if (settingsEntry) {
    const text = new TextDecoder().decode(settingsEntry.data);
    try {
      // Settings must be a plain object (not an array / null), otherwise
      // `loadSettings` would spread it into DEFAULT_SETTINGS and silently reset
      // the user's provider config (including the API key).
      const parsed = JSON.parse(text);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('settings must be a JSON object');
      }
      localStorage.setItem(SETTINGS_KEY, text);
      result.imported.push(SETTINGS_FILE);
    } catch {
      result.errors.push(SETTINGS_FILE);
    }
  }

  // Local mode is a user preference, not part of the data — leave it untouched
  // (the export records its value in meta.json for reference only).

  refreshAll();
  return result;
}

/** Notify every data layer's subscribers (used after an external DB refresh). */
export function refreshAll(): void {
  refreshAssets();
  refreshScenes();
  refreshMaps();
  refreshAnimations();
}

export { isLocalMode, setLocalMode, SETTINGS_KEY };
