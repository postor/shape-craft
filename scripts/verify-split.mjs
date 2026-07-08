// Verify: with the "reply in normal text, tool only for data" prompt, does the
// model stream its answer in `content` (early) while the tool call finishes later?
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
    description: 'Build or modify a 3D component. ONLY structured data; no user-facing prose.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { type: 'string', enum: ['tree', 'flower', 'grass', 'house', 'rock', 'road', 'decor', 'other'] },
        description: { type: 'string' },
        update: { type: 'boolean' },
        root: { type: 'object', additionalProperties: true },
      },
      required: ['name', 'category', 'update', 'root'],
    },
  },
};

const SYSTEM = `You are a 3D modeling assistant.
ALWAYS write your natural-language reply to the user as your NORMAL text message (it is streamed to the user live, so they see it immediately). Do NOT put user-facing prose inside the tool arguments.
Use the create_component tool ONLY for structured component data (name/category/description/root/update).
Set update:true when you create/modify a component (saved). Set update:false to ask for more info.
Always reply in the same language as the user.`;

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
      { role: 'system', content: SYSTEM },
      { role: 'user', content: '造一个带门和小窗的红色小房子。' },
    ],
  }),
});
console.log('[verify] HTTP', res.status);
const reader = res.body.getReader();
const dec = new TextDecoder();
let buffer = '';
let content = '';
let toolArgs = '';
let contentFirstAt = -1;
let toolStartAt = -1;
let step = 0;
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
    step++;
    if (typeof d.content === 'string' && d.content) {
      if (contentFirstAt < 0) contentFirstAt = step;
      content += d.content;
    }
    const tc = d.tool_calls?.[0];
    if (tc?.function?.arguments) {
      if (toolStartAt < 0) toolStartAt = step;
      toolArgs += tc.function.arguments;
    }
  }
}
console.log('[verify] content first seen at step:', contentFirstAt, '| tool args start at step:', toolStartAt);
console.log('[verify] content (answer):', JSON.stringify(content));
console.log('[verify] content empty?', content.trim().length === 0);
let parsed = {}; try { parsed = JSON.parse(toolArgs); } catch {}
console.log('[verify] tool.update:', parsed.update, '| tool.name:', parsed.name, '| tool has message field?', 'message' in parsed);
console.log(content.trim() && contentFirstAt > 0 && (toolStartAt < 0 || contentFirstAt <= toolStartAt)
  ? 'SPLIT ✅ (answer streamed in content, independent of tool call)'
  : 'SPLIT ⚠️ (answer not cleanly separated)');
