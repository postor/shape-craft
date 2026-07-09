import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../data');

type Mode = 'export' | 'import' | 'import-json';

interface Args {
  mode: Mode;
  target: string;
}

function parseArgs(argv: string[]): Args {
  const mode = argv[2] as Mode | undefined;
  const target = argv[3];
  if ((mode !== 'export' && mode !== 'import' && mode !== 'import-json') || !target) {
    throw new Error(
      'Usage:\n' +
        '  export <out.zip>        bundle all data/*.json into a zip\n' +
        '  import <in.zip>         extract a zip into data/ (overwrites existing files)\n' +
        '  import-json <in.json>   upsert a self-contained { scene(s), animations, assets } export into data/',
    );
  }
  return { mode, target: resolve(process.cwd(), target) };
}

function dataJsonFiles(): string[] {
  if (!existsSync(DATA_DIR)) return [];
  return readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
}

async function exportDb(zipPath: string): Promise<void> {
  const files = dataJsonFiles();
  if (files.length === 0) throw new Error(`No data/*.json files found in ${DATA_DIR}`);
  mkdirSync(dirname(zipPath), { recursive: true });
  if (existsSync(zipPath)) rmSync(zipPath);
  // -j: junk paths (store flat), -X: no extra attributes
  await exec('zip', ['-j', '-X', zipPath, ...files.map((f) => resolve(DATA_DIR, f))]);
  console.log(`Exported ${files.length} file(s) -> ${zipPath}`);
  console.log(`  ${files.join(', ')}`);
}

async function importDb(zipPath: string): Promise<void> {
  if (!existsSync(zipPath)) throw new Error(`Zip not found: ${zipPath}`);
  mkdirSync(DATA_DIR, { recursive: true });
  // -o: overwrite; -j style not needed, extract straight into data/
  await exec('unzip', ['-o', zipPath, '-d', DATA_DIR]);
  const imported = dataJsonFiles();
  console.log(`Imported into ${DATA_DIR}`);
  console.log(`  ${imported.join(', ')}`);
}

interface HasId {
  id: string;
}

function readArray<T extends HasId>(file: string): T[] {
  const p = resolve(DATA_DIR, file);
  if (!existsSync(p)) return [];
  const parsed = JSON.parse(readFileSync(p, 'utf8'));
  return Array.isArray(parsed) ? (parsed as T[]) : [];
}

/** Upsert `incoming` records into `file` by id (incoming wins). */
function upsertArray<T extends HasId>(file: string, incoming: T[]): number {
  if (incoming.length === 0) return 0;
  const existing = readArray<T>(file);
  const byId = new Map(existing.map((r) => [r.id, r]));
  for (const rec of incoming) byId.set(rec.id, rec);
  writeFileSync(resolve(DATA_DIR, file), JSON.stringify([...byId.values()], null, 2));
  return incoming.length;
}

function importJson(jsonPath: string): void {
  if (!existsSync(jsonPath)) throw new Error(`JSON not found: ${jsonPath}`);
  mkdirSync(DATA_DIR, { recursive: true });
  const doc = JSON.parse(readFileSync(jsonPath, 'utf8')) as {
    scene?: HasId;
    scenes?: HasId[];
    animations?: HasId[];
    assets?: HasId[];
  };
  const scenes = doc.scenes ?? (doc.scene ? [doc.scene] : []);
  const nAssets = upsertArray('assets.json', doc.assets ?? []);
  const nScenes = upsertArray('scenes.json', scenes);
  const nAnims = upsertArray('animations.json', doc.animations ?? []);
  console.log(`Imported JSON into ${DATA_DIR}`);
  console.log(`  assets: ${nAssets}, scenes: ${nScenes}, animations: ${nAnims}`);
  console.log('  (restart the API if it was running to pick up the new data)');
}

async function main(): Promise<void> {
  const { mode, target } = parseArgs(process.argv);
  if (mode === 'export') await exportDb(target);
  else if (mode === 'import') await importDb(target);
  else importJson(target);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
