// Verify SSE streaming + incremental tool-call parsing against the real model.
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
    description: 'Build or modify a 3D component.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { type: 'string', enum: ['tree', 'flower', 'grass', 'house', 'rock', 'road', 'decor', 'other'] },
        description: { type: 'string' },
        message: { type: 'string' },
        update: { type: 'boolean' },
        root: { type: 'object', additionalProperties: true },
      },
      required: ['name', 'category', 'message', 'update', 'root'],
    },
  },
};

const res = await fetch(`${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
  body: JSON.stringify({
    model: cfg.model,
    temperature: 0.6,
    stream: true,
    tools: [tool],
    tool_choice: 'auto',
    messages: [
      { role: 'system', content: 'Use create_component. Set update:true to save. Reply in same language. Stream your message field early.' },
      { role: 'user', content: 'Create a small red house with a door.' },
    ],
  }),
});
console.log('[stream] HTTP', res.status);
const reader = res.body.getReader();
const dec = new TextDecoder();
let buffer = '';
let content = '';
let toolArgs = '';
let shown = 0;
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += dec.decode(value, { stream: true });
  let nl;
  while ((nl = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line.startsWith('data:')) continue;
    const data = line.slice(5).trim();
    if (data === '[DONE]') continue;
    let j; try { j = JSON.parse(data); } catch { continue; }
    const d = j?.choices?.[0]?.delta ?? {};
    if (typeof d.content === 'string') { content += d.content; }
    const tc = d.tool_calls?.[0];
    if (tc?.function?.arguments) {
      toolArgs += tc.function.arguments;
      try {
        const p = JSON.parse(toolArgs);
        if (typeof p.message === 'string' && p.message.length > shown) {
          console.log('[stream] progress @', p.message.length, 'chars ->', p.message.slice(0, 40) + '…');
          shown = p.message.length;
        }
      } catch {}
    }
  }
}
console.log('[stream] content:', JSON.stringify(content));
console.log('[stream] toolArgs length:', toolArgs.length);
let finalMsg = '';
try { finalMsg = JSON.parse(toolArgs).message; } catch {}
console.log('[stream] final message:', finalMsg);
console.log('STREAMING ✅');
