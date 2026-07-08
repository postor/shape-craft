// Test OpenAI tool-calling support for tencent/hy3:free via OpenRouter.
import { readFileSync } from 'node:fs';

const env = {};
for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}
const cfg = { baseUrl: env.OPENAI_BASE_URL, apiKey: env.OPENAI_KEY, model: env.OPENAI_MODEL };

const tool = {
  type: 'function',
  function: {
    name: 'create_component',
    description: 'Create or modify a 3D component. Return the full part tree.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { type: 'string', enum: ['tree', 'flower', 'grass', 'house', 'rock', 'road', 'decor', 'other'] },
        description: { type: 'string' },
        message: { type: 'string' },
        update: { type: 'boolean' },
        root: {
          type: 'object',
          description: 'Root part of the component tree',
          properties: {
            name: { type: 'string' },
            shape: { type: 'string', enum: ['box', 'sphere', 'cylinder', 'cone', 'plane', 'triangle'] },
            size: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } } },
            position: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } } },
            rotation: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } } },
            scale: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } } },
            material: { type: 'object', properties: { color: { type: 'string' }, roughness: { type: 'number' }, metalness: { type: 'number' } } },
            children: { type: 'array', items: { type: 'object' } },
          },
          required: ['name', 'shape', 'size'],
        },
      },
      required: ['name', 'category', 'message', 'update', 'root'],
    },
  },
};

const url = `${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`;
const body = {
  model: cfg.model,
  temperature: 0.6,
  tools: [tool],
  tool_choice: 'auto',
  messages: [
    { role: 'system', content: 'You are a 3D modeling assistant. Use the create_component tool. Set update:true when you create/modify a component (it will be saved). If you need MORE info before changing anything, set update:false and ask in message. Always reply in the same language as the user.' },
    { role: 'user', content: 'Create a small red house with a door and two windows.' },
  ],
};

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
  body: JSON.stringify(body),
});
console.log('[toolcall] HTTP', res.status);
if (!res.ok) { console.error('FAILED:', await res.text()); process.exit(1); }
const data = await res.json();
const msg = data?.choices?.[0]?.message;
console.log('[toolcall] finish_reason:', data?.choices?.[0]?.finish_reason);
console.log('[toolcall] tool_calls  :', JSON.stringify(msg?.tool_calls ?? null, null, 2));
if (msg?.tool_calls?.length) {
  const args = JSON.parse(msg.tool_calls[0].function.arguments);
  const count = (function n(p) { return 1 + (p.children || []).reduce((a, c) => a + n(c), 0); })(args.root);
  console.log('[toolcall] name:', args.name, '| update:', args.update, '| parts:', count);
  console.log('TOOL CALLING ✅');
} else {
  console.log('[toolcall] no tool call; content:', msg?.content);
}
