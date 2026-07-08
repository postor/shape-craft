import type { AssetCategory, AssetComponent, AssetInput, AssetPart, ShapeType, Vec3 } from '@shape-craft/schema';
import { createEmptyAsset } from '@shape-craft/schema';
import { PREFAB_TEMPLATES, templateByKey } from '@shape-craft/schema';
import { loadSettings } from './settings.ts';

export interface AgentContext {
  /** The component currently being edited (so the AI can modify it). */
  asset?: AssetComponent;
  /** Currently selected part id (AI may target it). */
  selectedId?: string | null;
  /** Whether the asset has not been persisted yet. */
  isNew?: boolean;
}

export interface AgentResult {
  message: string;
  asset?: AssetComponent;
  /** whether the result came from a real LLM call */
  usedLLM?: boolean;
  /** raw JSON string returned by the model (for debugging the "toolcall") */
  raw?: string;
}

const SYNONYMS: Record<string, string> = {
  tree: 'tree',
  树: 'tree',
  树木: 'tree',
  flower: 'flower',
  花: 'flower',
  grass: 'grass',
  草: 'grass',
  house: 'house',
  房子: 'house',
  房屋: 'house',
  home: 'house',
};

function detectKind(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [word, kind] of Object.entries(SYNONYMS)) {
    if (lower.includes(word.toLowerCase()) || text.includes(word)) return kind;
  }
  for (const t of PREFAB_TEMPLATES) {
    if (lower.includes(t.key)) return t.key;
  }
  return undefined;
}

function ruleBased(prompt: string): AgentResult {
  // Minimal, generic fallback used ONLY when no AI is configured. The AI path
  // (callLLM) is responsible for actually understanding and following user
  // instructions — we do not add per-task heuristics here.
  const kind = detectKind(prompt);
  if (kind) {
    const template = templateByKey(kind);
    if (template) {
      const input: AssetInput = {
        name: template.defaultName,
        category: template.key as AssetCategory,
        description: `由聊天自动生成：${prompt}`,
        root: template.build(),
      };
      const asset = createEmptyAsset(input.name, input.category);
      asset.root = input.root;
      asset.description = input.description;
      return {
        message: `已为你生成「${template.label}」。启用 OpenAI 兼容接口后，即可用自然语言自由生成与修改（如改色、加部件、变形）。`,
        asset,
      };
    }
  }
  return {
    message:
      '未启用 AI。当前仅支持创建 树/花/草/房子（如“造一棵树”）。在「设置」中配置 OpenAI 兼容接口后，即可用自然语言自由生成与修改元件。',
  };
}

// ---- OpenAI-compatible generation ----

/**
 * Generalized contract for the LLM: a clear schema description + a full example.
 * We deliberately avoid hardcoding domain rules (e.g. "leaves must be triangle");
 * the example demonstrates the conventions and the model is free to create/modify
 * the whole component tree as it sees fit. The editor loads the COMPLETE JSON the
 * model returns (see `callLLM` -> `sanitizePart` -> editor `saveCurrent`).
 */
const SCHEMA_HINT = `You are a 3D modeling assistant for ShapeCraft. A component is a JSON tree of primitive parts.

SCHEMA (strict JSON shape):
Component = { "name": string, "category": "tree"|"flower"|"grass"|"house"|"rock"|"road"|"decor"|"other", "description": string, "message": string (a short natural-language reply to the user, in the same language as the request), "root": Part }
Part = {
  "name": string,
  "shape": "box"|"sphere"|"cylinder"|"cone"|"plane"|"triangle",
  "size": {"x":number,"y":number,"z":number},
  "position": {"x":number,"y":number,"z":number},
  "rotation": {"x":number,"y":number,"z":number},
  "scale": {"x":number,"y":number,"z":number},
  "material": {"color":"#rrggbb","roughness":number0to1,"metalness":number0to1},
  "children": [Part]
}
Geometry notes:
- box: size = width/height/depth
- sphere: size.x = radius
- cylinder: size.x = radius, size.y = height
- cone: size.x = radius, size.y = height
- plane: size.x = width, size.y = height (flat quad)
- triangle: a flat, double-sided triangle; size.x = width, size.y = height

GENERAL RULES:
- Always respond with ONLY the JSON object, no markdown or prose.
- When CREATING, return the COMPLETE Component (the entire root tree).
- When the user asks to MODIFY an existing component, edit the provided JSON IN PLACE and return the COMPLETE updated Component.
- When MODIFYING, transform the existing relevant parts in the returned tree (resize / recolor / replace shape / move). The returned Component must reflect the change WITHOUT leaving both the old and the new version behind — no redundant duplicates.
- You have full freedom to add, remove, recolor, rescale, rotate, or restructure parts to satisfy the request. Follow the user's intent.
- Keep it coherent and reasonably sized (prefer <= 40 parts). Use pleasing basic materials.

TOOL USAGE:
- ALWAYS write your natural-language reply to the user as your NORMAL text message (it is streamed to the user live, so they see it immediately). Do NOT put user-facing prose inside the tool arguments.
- Use the \`create_component\` tool ONLY for the structured component data (name / category / description / root / update).
- Set \`update: true\` whenever you actually create or modify a component (it will be saved). Set \`update: false\` when you need MORE information from the user before making any change — then ask your question in the normal text reply and DO NOT include a real component (nothing will be saved).
- Always reply in the SAME language as the user's request.`;

// A full example that teaches the expected format AND conventions (e.g. flat
// triangular leaves, sensible materials) by demonstration rather than by rules.
const EXAMPLE_ASSET = {
  name: 'Oak Tree',
  category: 'tree',
  description: 'A stylized tree with a brown trunk and flat triangular green leaves.',
  root: {
    name: 'Tree',
    shape: 'box',
    size: { x: 0.01, y: 0.01, z: 0.01 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    material: { color: '#000000', roughness: 0.8, metalness: 0.05 },
    children: [
      {
        name: 'Trunk',
        shape: 'cylinder',
        size: { x: 0.18, y: 1.2, z: 0.18 },
        position: { x: 0, y: 0.6, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        material: { color: '#7a4f2a', roughness: 0.9, metalness: 0.0 },
        children: [],
      },
      {
        name: 'Leaves',
        shape: 'box',
        size: { x: 0.01, y: 0.01, z: 0.01 },
        position: { x: 0, y: 1.6, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        material: { color: '#000000', roughness: 0.8, metalness: 0.05 },
        children: [
          { name: 'Leaf1', shape: 'triangle', size: { x: 0.35, y: 0.5, z: 0.01 }, position: { x: 0.4, y: 0.1, z: 0 }, rotation: { x: 0, y: 0, z: 1.2 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#3f8f3a', roughness: 0.8, metalness: 0.05 }, children: [] },
          { name: 'Leaf2', shape: 'triangle', size: { x: 0.35, y: 0.5, z: 0.01 }, position: { x: -0.4, y: 0.1, z: 0 }, rotation: { x: 0, y: 0, z: -1.2 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#4caf50', roughness: 0.8, metalness: 0.05 }, children: [] },
          { name: 'Leaf3', shape: 'triangle', size: { x: 0.35, y: 0.5, z: 0.01 }, position: { x: 0, y: 0.2, z: 0.4 }, rotation: { x: 1.2, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#4caf50', roughness: 0.8, metalness: 0.05 }, children: [] },
        ],
      },
    ],
  },
};

const SHAPES: ShapeType[] = ['box', 'sphere', 'cylinder', 'cone', 'plane', 'triangle'];

// JSON-schema description of a single Part, reused inside the tool definition.
const PART_PROPS = {
  name: { type: 'string' },
  shape: { type: 'string', enum: SHAPES },
  size: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } }, additionalProperties: true },
  position: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } }, additionalProperties: true },
  rotation: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } }, additionalProperties: true },
  scale: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } }, additionalProperties: true },
  material: { type: 'object', properties: { color: { type: 'string' }, roughness: { type: 'number' }, metalness: { type: 'number' } }, additionalProperties: true },
  children: { type: 'array', items: { type: 'object', additionalProperties: true } },
};

// OpenAI-compatible function tool. The `update` flag lets the model ask for
// clarification WITHOUT producing a component: when update=false the editor
// will NOT save/modify anything.
const CREATE_TOOL = {
  type: 'function',
  function: {
    name: 'create_component',
    description:
      'Build or modify a 3D component as a tree of primitive parts. Call this whenever you actually create or change a component.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { type: 'string', enum: ['tree', 'flower', 'grass', 'house', 'rock', 'road', 'decor', 'other'] },
        description: { type: 'string' },
        update: {
          type: 'boolean',
          description:
            'Set true when you create/modify the component and want it saved. Set false when you need MORE information from the user before making any change — then no component is produced and nothing is saved.',
        },
        root: {
          type: 'object',
          description: 'Root part of the component tree (each part may contain children parts).',
          properties: PART_PROPS,
          additionalProperties: true,
        },
      },
      required: ['name', 'category', 'update', 'root'],
    },
  },
};

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && isFinite(v) ? v : fallback;
}
function vec(v: any, fx: number, fy: number, fz: number): Vec3 {
  return { x: num(v?.x, fx), y: num(v?.y, fy), z: num(v?.z, fz) };
}
function sanitizePart(p: any, index: { i: number }): AssetPart {
  index.i += 1;
  const shape: ShapeType = SHAPES.includes(p?.shape) ? p.shape : 'box';
  const color = typeof p?.material?.color === 'string' ? p.material.color : '#cccccc';
  const children = Array.isArray(p?.children) ? p.children.map((c: any) => sanitizePart(c, index)) : [];
  return {
    id: `part_${Date.now().toString(36)}_${index.i}`,
    name: typeof p?.name === 'string' ? p.name : `Part${index.i}`,
    shape,
    size: vec(p?.size, 1, 1, 1),
    position: vec(p?.position, 0, 0, 0),
    rotation: vec(p?.rotation, 0, 0, 0),
    scale: vec(p?.scale, 1, 1, 1),
    material: {
      color,
      roughness: Math.max(0, Math.min(1, num(p?.material?.roughness, 0.8))),
      metalness: Math.max(0, Math.min(1, num(p?.material?.metalness, 0.05))),
    },
    children,
  };
}

function contextPayload(ctx?: AgentContext) {
  if (!ctx?.asset) return null;
  const a = ctx.asset;
  return {
    name: a.name,
    category: a.category,
    description: a.description,
    root: a.root,
  };
}

async function callLLM(
  prompt: string,
  ctx?: AgentContext,
  onProgress?: (text: string) => void,
): Promise<AgentResult> {
  const cfg = loadSettings();
  const url = `${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const current = contextPayload(ctx);
  const userContent = current
    ? `Current component (modify it as requested, return the FULL updated JSON):\n${JSON.stringify(current)}\n\nRequest: ${prompt}`
    : `Create a new 3D component for: ${prompt}`;

  // NOTE: some OpenAI-compatible providers (e.g. tencent/hy3 via OpenRouter)
  // do NOT support `response_format: { type: 'json_object' }`. We use the
  // `create_component` tool instead (structured args, broadly supported), and
  // fall back to JSON-in-content if the provider does not return tool_calls.
  const requestBody: Record<string, unknown> = {
    model: cfg.model,
    temperature: 0.6,
    stream: true,
    tools: [CREATE_TOOL],
    tool_choice: 'auto',
    messages: [
      { role: 'system', content: SCHEMA_HINT },
      {
        role: 'assistant',
        content:
          'Understood. Here is an example component in the expected format:\n' +
          JSON.stringify(EXAMPLE_ASSET),
      },
      { role: 'user', content: userContent },
    ],
  };

  // Debug: print the exact request sent to the model.
  console.log('[agent] AI request ->', url, JSON.stringify(requestBody, null, 2));

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[agent] AI request failed', res.status, errText.slice(0, 200));
    throw new Error(`HTTP ${res.status} ${errText.slice(0, 120)}`);
  }

  // Stream the SSE response: surface any textual content (or the tool's
  // `message` field as it arrives) to the UI as early as possible.
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let content = '';
  let toolArgs = '';
  let lastShown = '';
  const show = (text: string) => {
    if (text && text !== lastShown) {
      lastShown = text;
      onProgress?.(text);
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') continue;
      let json: any;
      try {
        json = JSON.parse(data);
      } catch {
        continue;
      }
      const delta = json?.choices?.[0]?.delta ?? {};
      // The natural-language reply is streamed in `content`, independent of the
      // tool call — so the user sees it as soon as tokens arrive.
      if (typeof delta.content === 'string') {
        content += delta.content;
        show(content);
      }
      const tc = delta.tool_calls?.[0];
      if (tc?.function?.arguments) {
        toolArgs += tc.function.arguments;
      }
    }
  }

  const raw: string = toolArgs || content;
  if (!raw) throw new Error('模型未返回任何内容');

  // Debug: print the raw model output (the "toolcall" result).
  console.log('[agent] AI raw response ->', raw);

  const parsed = JSON.parse(raw);

  // The natural-language reply (already streamed) is the authoritative message.
  const reply = content.trim() || (typeof parsed?.message === 'string' ? parsed.message.trim() : '');

  // The model explicitly asks for more info: do NOT touch the component/data.
  if (parsed?.update === false) {
    return {
      message: reply || '需要更多信息后再修改（未更新数据）。',
      usedLLM: true,
      raw,
    };
  }

  const root = sanitizePart(parsed?.root ?? parsed, { i: 0 });
  if (!root.children.length && root.shape === 'box' && root.size.x === 1 && root.size.y === 1) {
    throw new Error('模型未返回有效的元件结构');
  }

  const asset = createEmptyAsset(
    typeof parsed?.name === 'string' ? parsed.name : (ctx?.asset?.name ?? 'AI Component'),
    (SHAPES.includes(parsed?.category) ? parsed.category : (ctx?.asset?.category ?? 'other')) as AssetCategory,
  );
  asset.root = root;
  asset.description = typeof parsed?.description === 'string' ? parsed.description : `由 AI 生成：${prompt}`;

  const modelMessage = reply || `AI（${cfg.model}）已${current ? '修改' : '生成'}「${asset.name}」并自动保存。`;

  return {
    message: modelMessage,
    asset,
    usedLLM: true,
    raw,
  };
}

/**
 * Chat agent entry point. Uses the configured OpenAI-compatible provider when
 * enabled (and can modify the current component via context), otherwise falls
 * back to the built-in rule-based generator.
 */
export async function runAgent(
  prompt: string,
  ctx?: AgentContext,
  onProgress?: (text: string) => void,
): Promise<AgentResult> {
  const cfg = loadSettings();
  // No AI configured: the chat cannot talk to a model, so explain how to enable it.
  if (!cfg.enabled || !cfg.apiKey) {
    return ruleBased(prompt);
  }
  // AI is configured: always return the model's feedback (its message on success,
  // or the error on failure) as a normal conversation turn — no rule substitution.
  try {
    return await callLLM(prompt, ctx, onProgress);
  } catch (e) {
    return {
      message: `AI 调用失败：${(e as Error).message}`,
      usedLLM: true,
    };
  }
}
