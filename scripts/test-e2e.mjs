// Final e2e check mirroring agent.ts callLLM: stream content live, build asset
// from tool at end, final message = streamed content (independent of tool).
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
ALWAYS write your natural-language reply to the user as your NORMAL text message (it is streamed to the user live). Do NOT put user-facing prose inside the tool arguments.
Use the create_component tool ONLY for structured component data (name/category/description/root/update).
Set update:true when you create/modify a component. Set update:false to ask for more info.
Always reply in the same language as the user.`;

const res = await fetch(`${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
  body: JSON.stringify({
    model: cfg.model, temperature: 0.6, stream: true, tools: [tool], tool_choice: 'auto',
    messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: '造一个带门和小窗的红色小房子。' }],
  }),
});
const reader = res.body.getReader();
const dec = new TextDecoder();
let buffer = '', content = '', toolArgs = '', shown = 0;
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += dec.decode(value, { stream: true });
  let nl;
  while ((nl = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, nl).trim(); buffer = buffer.slice(nl + 1);
    if (!line.startsWith('data:')) continue;
    const data = line.slice(5).trim(); if (data === '[DONE]') continue;
    let j; try { j = JSON.parse(data); } catch { continue; }
    const d = j?.choices?.[0]?.delta ?? {};
    if (typeof d.content === 'string') {
      content += d.content;
      if (content.length > shown) { console.log('[e2e] streamed ->', content.slice(0, 30) + '…'); shown = content.length; }
    }
    if (d.tool_calls?.[0]?.function?.arguments) toolArgs += d.tool_calls[0].function.arguments;
  }
}
const parsed = JSON.parse(toolArgs || '{}');
const finalMessage = content.trim() || parsed.message || 'fallback';
console.log('[e2e] final message:', finalMessage);
console.log('[e2e] update:', parsed.update, '| name:', parsed.name, '| built asset:', !!parsed.root);
console.log(finalMessage === content.trim() && parsed.root && parsed.update === true
  ? 'E2E ✅ (message=streamed content, asset built from separate tool call)'
  : 'E2E ⚠️ mismatch');
