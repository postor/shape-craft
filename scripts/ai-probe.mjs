// Standalone probe that reproduces the exact request the app sends to the
// OpenAI-compatible chat endpoint, and prints the request + raw model output.
//
// Usage (key stays on your machine, never sent to me):
//   OPENAI_API_KEY=sk-... OPENAI_MODEL=gpt-4o-mini \
//   OPENAI_BASE_URL=https://api.openai.com/v1 node scripts/ai-probe.mjs
//
import { readFileSync } from 'node:fs';

const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const BASE = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
if (!KEY) {
  console.error('Set OPENAI_API_KEY (and optionally OPENAI_MODEL / OPENAI_BASE_URL).');
  process.exit(1);
}

const SCHEMA_HINT = `You are a 3D modeling assistant for ShapeCraft. A component is a JSON tree of primitive parts.

SCHEMA (strict JSON shape):
Component = { "name": string, "category": "tree"|"flower"|"grass"|"house"|"rock"|"road"|"decor"|"other", "description": string, "message": string (short natural-language reply to the user), "root": Part }
Part = { "name": string, "shape": "box"|"sphere"|"cylinder"|"cone"|"plane"|"triangle", "size": {"x":number,"y":number,"z":number}, "position": {"x":number,"y":number,"z":number}, "rotation": {"x":number,"y":number,"z":number}, "scale": {"x":number,"y":number,"z":number}, "material": {"color":"#rrggbb","roughness":number0to1,"metalness":number0to1}, "children": [Part] }
Geometry notes: box=w/h/d; sphere size.x=radius; cylinder size.x=radius,size.y=height; cone size.x=radius,size.y=height; plane size.x=width,size.y=height; triangle=flat double-sided, size.x=width,size.y=height.
GENERAL RULES: respond ONLY JSON; when CREATING return COMPLETE component; when MODIFYING edit in place and return COMPLETE updated component; you may freely add/remove/recolor/rescale/rotate/restructure; keep <=40 parts.`;

// Example (also embedded in the app to teach conventions).
const EXAMPLE_ASSET = {
  name: 'Oak Tree', category: 'tree',
  description: 'A stylized tree with a brown trunk and flat triangular green leaves.',
  root: {
    name: 'Tree', shape: 'box', size: { x: 0.01, y: 0.01, z: 0.01 }, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#000000', roughness: 0.8, metalness: 0.05 },
    children: [
      { name: 'Trunk', shape: 'cylinder', size: { x: 0.18, y: 1.2, z: 0.18 }, position: { x: 0, y: 0.6, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#7a4f2a', roughness: 0.9, metalness: 0 }, children: [] },
      { name: 'Leaves', shape: 'box', size: { x: 0.01, y: 0.01, z: 0.01 }, position: { x: 0, y: 1.6, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#000000', roughness: 0.8, metalness: 0.05 },
        children: [
          { name: 'Leaf1', shape: 'triangle', size: { x: 0.35, y: 0.5, z: 0.01 }, position: { x: 0.4, y: 0.1, z: 0 }, rotation: { x: 0, y: 0, z: 1.2 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#3f8f3a', roughness: 0.8, metalness: 0.05 }, children: [] },
          { name: 'Leaf2', shape: 'triangle', size: { x: 0.35, y: 0.5, z: 0.01 }, position: { x: -0.4, y: 0.1, z: 0 }, rotation: { x: 0, y: 0, z: -1.2 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#4caf50', roughness: 0.8, metalness: 0.05 }, children: [] },
        ] },
    ],
  },
};

// Sample current component (a tree) to demonstrate an in-place modification.
const current = JSON.parse(readFileSync(new URL('./sample-tree.json', import.meta.url), 'utf-8'));

const userRequest = process.argv[2] || '把叶子改成大片';
const userContent = `Current component (modify it as requested, return the FULL updated JSON):\n${JSON.stringify(current)}\n\nRequest: ${userRequest}`;

const messages = [
  { role: 'system', content: SCHEMA_HINT },
  { role: 'assistant', content: 'Understood. Here is an example component in the expected format:\n' + JSON.stringify(EXAMPLE_ASSET) },
  { role: 'user', content: userContent },
];

const requestBody = { model: MODEL, temperature: 0.6, response_format: { type: 'json_object' }, messages };

console.log('=== AI REQUEST ===');
console.log('URL:', `${BASE}/chat/completions`);
console.log(JSON.stringify(requestBody, null, 2));

const res = await fetch(`${BASE}/chat/completions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
  body: JSON.stringify(requestBody),
});
console.log('=== HTTP', res.status, '===');
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
const data = await res.json();
const content = data?.choices?.[0]?.message?.content ?? '';
console.log('=== AI RAW RESPONSE (toolcall) ===');
console.log(content);
