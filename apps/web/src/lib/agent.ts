import type { AssetCategory, AssetComponent, AssetPart, ShapeType, Vec3 } from '@shape-craft/schema';
import { createEmptyAsset, uid } from '@shape-craft/schema';
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

function ruleBased(_prompt: string): AgentResult {
  // Minimal, generic fallback used ONLY when no AI is configured. The AI path
  // (callLLM) is responsible for actually understanding and following user
  // instructions — we do not add per-task heuristics here.
  return {
    message:
      '未启用 AI。可在「设置」中配置 OpenAI 兼容接口后，用自然语言自由生成与修改元件（如“加一扇门”“把屋顶改成红色”），也可直接从工具栏添加基础形状 / 插入引用。',
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
Component = { "name": string, "category": "tree"|"flower"|"grass"|"house"|"rock"|"road"|"decor"|"other", "description": string, "root": Part }
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
  - instance: a reference to another saved component (prefab/character). It has
    NO children and NO own geometry; instead set "refId" to the id of the asset
    to embed. The referenced subtree renders as one locked, indivisible unit —
    like a primitive shape — so you can reuse a component without duplicating it.

  SCENE GRAPH / TRANSFORMS:
  - The part tree is a REAL scene graph. Each part's "position", "rotation", and
    "scale" are RELATIVE TO ITS PARENT, and a parent's transform is applied
    (accumulated) to its entire subtree. So to put a leaf on a branch, give the
    leaf a position RELATIVE TO THE BRANCH NODE — never a world coordinate.
    If you need to group several children under a shared local origin, insert an
    invisible container part (a tiny box, e.g. size {x:0.01,y:0.01,z:0.01},
    color "#000000") as their parent.
  - Do NOT center the model at the world origin (do NOT make the object span
    above AND below y=0). Always use a GROUND-BASED coordinate system: the center
    of the object's BASE / FOOTPRINT is (0,0,0) and the whole object sits ON the
    ground — i.e. the bottom of every part rests at y >= 0 and the object grows
    UPWARD (positive y). For example, a trunk of height h sits at position.y = h/2
    so its bottom touches 0 and its top reaches h.

  REAL-WORLD SIZE (always consider real dimensions):
  - Work in METERS and model the object at its real-world size. Before building,
    decide the actual dimensions of the thing it represents (e.g. an oak tree is
    ~8–12 m tall, a chair ~0.45 m seat height, a door ~2 m tall, a cat ~0.3 m at
    the shoulder) and scale every part's size/position to match those measurements.
    Keep the overall footprint and proportions believable, and keep the base
    centered at (0,0,0) as described above.
  - IDs are generated and managed by the system automatically (always unique).
    Do NOT use ids to express parent/child relationships — those come purely
    from the tree nesting. You may omit "id" entirely; any "id" you include
    will be ignored and replaced.

  GENERAL RULES:
- Always respond with ONLY the JSON object, no markdown or prose.
- When CREATING, return the COMPLETE Component (the entire root tree).
- When the user asks to MODIFY an existing component, edit the provided JSON IN PLACE and return the COMPLETE updated Component.
- When MODIFYING, transform the existing relevant parts in the returned tree (resize / recolor / replace shape / move). The returned Component must reflect the change WITHOUT leaving both the old and the new version behind — no redundant duplicates.
- You have full freedom to add, remove, recolor, rescale, rotate, or restructure parts to satisfy the request. Follow the user's intent.
- Keep it coherent and reasonably sized (prefer <= 40 parts). Use pleasing basic materials.
- ALWAYS write your conversational reply in your streamed TEXT (it is shown to the user live). Never put user-facing prose inside the tool arguments.

TOOL USAGE:
- ALWAYS write your natural-language reply to the user as your NORMAL text message (it is streamed to the user live, so they see it immediately). Do NOT put user-facing prose inside the tool arguments.
- Use the \`create_component\` tool ONLY for the structured component data (name / category / description / root / update).
- Set \`update: true\` whenever you actually create or modify a component (it will be saved). Set \`update: false\` when you need MORE information from the user before making any change — then ask your question in the normal text reply and DO NOT include a real component (nothing will be saved).
- Always reply in the SAME language as the user's request.`;

// A full example that teaches the expected format AND conventions by
// demonstration: a ~9 m oak tree on the GROUND (base centered at 0,0,0, trunk
// bottom at y=0, grows upward), flat triangular leaves grouped under an invisible
// "Canopy" container, each leaf's position RELATIVE to that container (scene-graph
// rule), realistic real-world meters-based dimensions, pleasing materials, and no
// "id" fields (the system assigns them).
const EXAMPLE_ASSET = {
  name: 'Oak Tree',
  category: 'tree',
  description: 'A ~9 m tall stylized oak tree: a 5 m brown trunk standing on the ground, with a flat-triangular-leaf canopy centered on top.',
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
        size: { x: 0.35, y: 5, z: 0.35 },
        position: { x: 0, y: 2.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        material: { color: '#7a4f2a', roughness: 0.9, metalness: 0.0 },
        children: [],
      },
      {
        name: 'Canopy',
        shape: 'box',
        size: { x: 0.01, y: 0.01, z: 0.01 },
        position: { x: 0, y: 7, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        material: { color: '#000000', roughness: 0.8, metalness: 0.05 },
        children: [
          { name: 'Leaf1', shape: 'triangle', size: { x: 3, y: 3, z: 0.01 }, position: { x: 2, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: 1.2 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#3f8f3a', roughness: 0.8, metalness: 0.05 }, children: [] },
          { name: 'Leaf2', shape: 'triangle', size: { x: 3, y: 3, z: 0.01 }, position: { x: -2, y: 0.5, z: 0 }, rotation: { x: 0, y: 0, z: -1.2 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#4caf50', roughness: 0.8, metalness: 0.05 }, children: [] },
          { name: 'Leaf3', shape: 'triangle', size: { x: 3, y: 3, z: 0.01 }, position: { x: 0, y: 1, z: 2 }, rotation: { x: 1.2, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 }, material: { color: '#4caf50', roughness: 0.8, metalness: 0.05 }, children: [] },
        ],
      },
    ],
  },
};

const SHAPES: ShapeType[] = ['box', 'sphere', 'cylinder', 'cone', 'plane', 'triangle', 'node', 'instance'];

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
  // An `instance` references another asset by id and never carries its own
  // subtree — ignore any children the model might try to nest inside it.
  const children =
    shape === 'instance'
      ? []
      : Array.isArray(p?.children)
        ? p.children.map((c: any) => sanitizePart(c, index))
        : [];
  return {
    // Use the schema's monotonic uid() so generated ids never collide — the old
    // `Date.now() + local index` scheme could duplicate ids within the same
    // millisecond across multiple sanitize passes, which made selecting one
    // part highlight several (shared id).
    id: uid(),
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
    ...(shape === 'instance' && typeof p?.refId === 'string' ? { refId: p.refId } : {}),
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
  opts?: { images?: string[]; verify?: boolean },
): Promise<AgentResult> {
  const cfg = loadSettings();
  const url = `${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const current = contextPayload(ctx);
  const userContent = current
    ? `Current component (modify it as requested, return the FULL updated JSON):\n${JSON.stringify(current)}\n\nRequest: ${prompt}`
    : `Create a new 3D component for: ${prompt}`;

  // In verify mode the user message is a multimodal prompt: a text instruction
  // plus the rendered preview image(s), so the model can visually judge the
  // result. Otherwise it is a plain text message.
  let userMessage: { role: 'user'; content: unknown };
  if (opts?.verify) {
    const verifyText =
      'Below is a rendered preview image of the current component. Visually verify whether it ' +
      'achieves the user’s intent (correct shapes, structure, proportions, colors, no obvious ' +
      'errors). If there is still something to improve or finish, return the COMPLETE updated ' +
      'component via the create_component tool (update:true). If it already satisfies the ' +
      'requirement, simply reply with the word “完成” in text — do NOT call the tool and do NOT ' +
      'return a component (update:false).';
    const parts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      { type: 'text', text: verifyText },
    ];
    if (current) parts.push({ type: 'text', text: `Current component JSON:\n${JSON.stringify(current)}` });
    for (const img of opts.images ?? []) parts.push({ type: 'image_url', image_url: { url: img } });
    userMessage = { role: 'user', content: parts };
  } else {
    userMessage = { role: 'user', content: userContent };
  }

  // NOTE: some OpenAI-compatible providers (e.g. tencent/hy3 via OpenRouter)
  // do NOT support `response_format: { type: 'json_object' }`. We use the
  // `create_component` tool instead (structured args, broadly supported), and
  // fall back to JSON-in-content if the provider does not return tool_calls.
  const requestBody: Record<string, unknown> = {
    model: cfg.model,
    temperature: 0.6,
    stream: true,
    tools: [CREATE_TOOL],
    // `auto` lets the model EITHER call `create_component` (make a change) OR
    // reply in plain text (e.g. ask the user for a more detailed description).
    tool_choice: 'auto',
    messages: [
      { role: 'system', content: SCHEMA_HINT },
      {
        role: 'assistant',
        content:
          'Understood. Here is an example component in the expected format:\n' +
          JSON.stringify(EXAMPLE_ASSET),
      },
      userMessage,
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
  // The verbatim response body exactly as received over the wire (every SSE
  // `data:` event), for full debugging visibility at the interface level.
  let wireResponse = '';
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
      // Capture the raw event payload verbatim (interface-level response).
      wireResponse += data + '\n';
      let json: any;
      try {
        json = JSON.parse(data);
      } catch {
        continue;
      }
      const delta = json?.choices?.[0]?.delta ?? {};
      // The natural-language reply is normally streamed in `content`. When the
      // provider leaves `content` null and wraps everything in the tool call,
      // fall back to streaming the tool arguments so the user still sees live
      // text (and the description) as it arrives.
      if (typeof delta.content === 'string') {
        content += delta.content;
        show(content);
      } else if (toolArgs) {
        show(toolArgs);
      }
      const tc = delta.tool_calls?.[0];
      if (tc?.function?.arguments) {
        toolArgs += tc.function.arguments;
        if (!content) show(toolArgs);
      }
    }
  }

  // The raw response exactly as returned by the `/chat/completions` endpoint
  // (every SSE `data:` event, verbatim), exposed in the `raw` field for full
  // interface-level visibility.
  const raw: string = wireResponse.trim() || content || toolArgs;
  if (!raw) throw new Error('模型未返回任何内容');

  // Debug: print the raw model output (the "toolcall" result).
  console.log('[agent] AI raw response ->', raw);

  // No tool call: the model replied in plain text. Treat it as a normal
  // conversation turn (e.g. asking the user for a more detailed description) —
  // do NOT parse JSON and do NOT modify the component.
  if (!toolArgs) {
    const reply = content.trim();
    if (!reply) throw new Error('模型未返回任何内容');
    return { message: reply, usedLLM: true, raw };
  }

  // Tool call present: the model returned structured component data. Parse the
  // pure tool arguments (NOT the display `raw`, which has a prefix).
  let parsed: any;
  try {
    parsed = JSON.parse(toolArgs);
  } catch {
    throw new Error(`模型未返回合法的 JSON（收到：${toolArgs.slice(0, 80)}）`);
  }

  // The model's own reply is shown to the user. Some providers stream the
  // natural-language reply in `content`; others (e.g. when everything is wrapped
  // in the tool call) leave `content` null and put the text in `description`.
  // Prefer `content`, then fall back to `description` — never a canned status.
  const reply = content.trim() || (typeof parsed?.description === 'string' ? parsed.description.trim() : '');

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

  // Prefer the AI's real text (content or description); only if the model
  // returned no text at all, fall back to a minimal note naming the component.
  const modelMessage = reply || `已更新「${asset.name}」`;

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

/**
 * Visual self-verification: renders the current component to an image and asks
 * the model whether further changes are needed. If the model returns an updated
 * component (via the tool call, update:true) it is surfaced in `result.asset`;
 * if the model replies "完成" (no tool call) `result.asset` is undefined and the
 * loop in the editor should stop.
 */
export async function verifyAsset(
  asset: AssetComponent,
  imageDataUrl: string,
  onProgress?: (text: string) => void,
): Promise<AgentResult> {
  const cfg = loadSettings();
  if (!cfg.enabled || !cfg.apiKey) {
    return { message: '未启用 AI，跳过可视化验证。', usedLLM: false };
  }
  try {
    return await callLLM('', { asset }, onProgress, { images: [imageDataUrl], verify: true });
  } catch (e) {
    return {
      message: `AI 验证失败：${(e as Error).message}`,
      usedLLM: true,
    };
  }
}
