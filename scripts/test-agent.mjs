// Faithful test of the agent's callLLM flow using the real .env values.
// Loads OPENAI_* from .env, builds the same request the web app sends,
// then validates the returned JSON produces a usable AssetPart tree.
import { readFileSync } from 'node:fs';

// ---- minimal .env loader ----
const env = {};
for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}
const cfg = {
  baseUrl: env.OPENAI_BASE_URL,
  apiKey: env.OPENAI_KEY,
  model: env.OPENAI_MODEL,
};
console.log('[test] config:', { baseUrl: cfg.baseUrl, model: cfg.model, key: cfg.apiKey.slice(0, 12) + '…' });

const SHAPES = ['box', 'sphere', 'cylinder', 'cone', 'plane', 'triangle'];
function num(v, f) { return typeof v === 'number' && isFinite(v) ? v : f; }
function vec(v, fx, fy, fz) { return { x: num(v?.x, fx), y: num(v?.y, fy), z: num(v?.z, fz) }; }
function sanitizePart(p, index) {
  index.i += 1;
  const shape = SHAPES.includes(p?.shape) ? p.shape : 'box';
  const children = Array.isArray(p?.children) ? p.children.map((c) => sanitizePart(c, index)) : [];
  return {
    name: typeof p?.name === 'string' ? p.name : `Part${index.i}`,
    shape,
    size: vec(p?.size, 1, 1, 1),
    position: vec(p?.position, 0, 0, 0),
    rotation: vec(p?.rotation, 0, 0, 0),
    scale: vec(p?.scale, 1, 1, 1),
    material: { color: typeof p?.material?.color === 'string' ? p.material.color : '#cccccc', roughness: 0.8, metalness: 0.05 },
    children,
  };
}

const prompt = 'Create a small red house with a door and two windows.';
const url = `${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`;
const body = {
  model: cfg.model,
  temperature: 0.6,
  messages: [
    { role: 'system', content: 'You are a 3D modeling assistant. Respond ONLY with JSON: {name,category,description,message,root}. root is a Part tree with shape in box|sphere|cylinder|cone|plane|triangle.' },
    { role: 'user', content: `Create a new 3D component for: ${prompt}` },
  ],
};

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
  body: JSON.stringify(body),
});
console.log('[test] HTTP', res.status);
if (!res.ok) { console.error('FAILED:', await res.text()); process.exit(1); }
const data = await res.json();
const content = data?.choices?.[0]?.message?.content ?? '';
const parsed = JSON.parse(content);
const root = sanitizePart(parsed?.root ?? parsed, { i: 0 });
const count = (function n(p) { return 1 + p.children.reduce((a, c) => a + n(c), 0); })(root);
console.log('[test] name   :', parsed?.name);
console.log('[test] category:', parsed?.category);
console.log('[test] message:', parsed?.message);
console.log('[test] parts  :', count, '| root shape:', root.shape, '| children:', root.children.length);
console.log('VALID ✅' , count > 1 ? '(non-trivial component returned)' : '(WARNING: trivial)');
