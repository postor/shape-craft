/**
 * Minimal, dependency-free ZIP reader/writer.
 *
 * Uses the browser-native `CompressionStream` / `DecompressionStream` with the
 * `deflate-raw` algorithm when available, and transparently falls back to the
 * STORE (no compression) method when they are not. The produced archives are
 * standard ZIP files that any OS unzip tool can open, and we can parse them back.
 *
 * We deliberately avoid adding a third-party library (e.g. JSZip) so the local
 * database export/import feature carries no new runtime dependencies.
 */

// ---- CRC32 (IEEE) ----

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function strBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

// ---- deflate / inflate via web streams (with graceful STORE fallback) ----

async function deflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const CS = (globalThis as unknown as { CompressionStream?: new (fmt: string) => TransformStream })
    .CompressionStream;
  if (!CS) return data;
  try {
    const stream = new Response(
      new Blob([data as BlobPart]).stream().pipeThrough(new CS('deflate-raw') as TransformStream),
    );
    return new Uint8Array(await stream.arrayBuffer());
  } catch {
    return data;
  }
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const DS = (globalThis as unknown as { DecompressionStream?: new (fmt: string) => TransformStream })
    .DecompressionStream;
  if (!DS) throw new Error('当前浏览器不支持 DecompressionStream，无法解压 ZIP');
  const stream = new Response(
    new Blob([data as BlobPart]).stream().pipeThrough(new DS('deflate-raw') as TransformStream),
  );
  return new Uint8Array(await stream.arrayBuffer());
}

// ---- low-level byte helpers (little-endian) ----

function pushU16(arr: number[], v: number): void {
  arr.push(v & 0xff, (v >>> 8) & 0xff);
}
function pushU32(arr: number[], v: number): void {
  arr.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
}

const SIG_LOCAL = 0x04034b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_EOCD = 0x06054b50;

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

/** Build a standard ZIP archive from the given files. */
export async function createZip(files: ZipEntry[]): Promise<Blob> {
  const out: number[] = [];
  const central: number[] = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = strBytes(f.name);
    const crc = crc32(f.data);
    const comp = await deflateRaw(f.data);
    // Only use deflate when it actually shrinks the payload; otherwise STORE.
    const method = comp.length < f.data.length ? 8 : 0;
    const finalData = method === 8 ? comp : f.data;
    const localOffset = offset;

    // Local file header
    pushU32(out, SIG_LOCAL);
    pushU16(out, 20); // version needed
    pushU16(out, 0); // flags
    pushU16(out, method);
    pushU16(out, 0); // mod time
    pushU16(out, 0); // mod date
    pushU32(out, crc);
    pushU32(out, finalData.length);
    pushU32(out, f.data.length);
    pushU16(out, nameBytes.length);
    pushU16(out, 0); // extra len
    for (const b of nameBytes) out.push(b);
    for (const b of finalData) out.push(b);

    offset += 30 + nameBytes.length + finalData.length;

    // Central directory header
    pushU32(central, SIG_CENTRAL);
    pushU16(central, 20); // version made by
    pushU16(central, 20); // version needed
    pushU16(central, 0); // flags
    pushU16(central, method);
    pushU16(central, 0); // mod time
    pushU16(central, 0); // mod date
    pushU32(central, crc);
    pushU32(central, finalData.length);
    pushU32(central, f.data.length);
    pushU16(central, nameBytes.length);
    pushU16(central, 0); // extra len
    pushU16(central, 0); // comment len
    pushU16(central, 0); // disk number start
    pushU16(central, 0); // internal attrs
    pushU32(central, 0); // external attrs
    pushU32(central, localOffset);
    for (const b of nameBytes) central.push(b);
  }

  const centralSize = central.length;
  const centralOffset = offset;
  for (const b of central) out.push(b);

  // End of central directory record
  pushU32(out, SIG_EOCD);
  pushU16(out, 0); // disk number
  pushU16(out, 0); // disk with central dir
  pushU16(out, files.length); // entries this disk
  pushU16(out, files.length); // total entries
  pushU32(out, centralSize);
  pushU32(out, centralOffset);
  pushU16(out, 0); // comment len

  return new Blob([new Uint8Array(out)], { type: 'application/zip' });
}

/** Parse a standard ZIP archive back into its file entries. */
export async function extractZip(blob: Blob): Promise<ZipEntry[]> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

  // Locate the End Of Central Directory record by scanning backwards.
  let eocd = -1;
  const minPos = Math.max(0, buf.length - 22 - 0xffff);
  for (let i = buf.length - 22; i >= minPos; i--) {
    if (
      buf[i] === 0x50 &&
      buf[i + 1] === 0x4b &&
      buf[i + 2] === 0x05 &&
      buf[i + 3] === 0x06
    ) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('无效的 ZIP 文件（找不到目录结尾）');

  const total = dv.getUint16(eocd + 10, true);
  const centralOffset = dv.getUint32(eocd + 16, true);

  const entries: ZipEntry[] = [];
  let p = centralOffset;
  for (let i = 0; i < total; i++) {
    if (dv.getUint32(p, true) !== SIG_CENTRAL) {
      throw new Error('损坏的 ZIP 目录');
    }
    const method = dv.getUint16(p + 10, true);
    const crc = dv.getUint32(p + 16, true);
    const compSize = dv.getUint32(p + 20, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const localOffset = dv.getUint32(p + 42, true);

    const nameBytes = buf.subarray(p + 46, p + 46 + nameLen);
    const name = new TextDecoder().decode(nameBytes);

    // Read the (compressed) payload from the local file header.
    const lNameLen = dv.getUint16(localOffset + 26, true);
    const lExtraLen = dv.getUint16(localOffset + 28, true);
    const dataStart = localOffset + 30 + lNameLen + lExtraLen;
    const comp = buf.subarray(dataStart, dataStart + compSize);

    let data: Uint8Array;
    if (method === 0) {
      data = comp;
    } else if (method === 8) {
      data = await inflateRaw(comp);
    } else {
      throw new Error(`ZIP 使用了不支持的压缩方式：${method}`);
    }

    if (crc32(data) !== crc) {
      throw new Error(`ZIP 文件校验失败：${name}`);
    }

    entries.push({ name, data });
    p += 46 + nameLen + extraLen + commentLen;
  }

  return entries;
}
