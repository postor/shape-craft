import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../data');

type Mode = 'export' | 'import';

interface Args {
  mode: Mode;
  target: string;
}

function parseArgs(argv: string[]): Args {
  const mode = argv[2] as Mode | undefined;
  const target = argv[3];
  if ((mode !== 'export' && mode !== 'import') || !target) {
    throw new Error(
      'Usage:\n' +
        '  export <out.zip>   bundle all data/*.json into a zip\n' +
        '  import <in.zip>    extract a zip into data/ (overwrites existing files)',
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

async function main(): Promise<void> {
  const { mode, target } = parseArgs(process.argv);
  if (mode === 'export') await exportDb(target);
  else await importDb(target);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
