import type { AssetComponent, MapComponent, Vec3 } from '../schema';
import { createEmptyMap, createMapInstance, uid, vec3 } from '../schema';
import { loadSettings } from './settings.ts';

export interface MapAgentContext {
  /** The map currently being edited (so the AI can modify it). */
  map?: MapComponent;
  /** Available asset components, so the AI can place references. */
  assets?: AssetComponent[];
  /** Currently selected placed instance id (AI may target it). */
  selectedInstanceId?: string | null;
  /** Whether the map has not been persisted yet. */
  isNew?: boolean;
}

export interface MapAgentResult {
  message: string;
  map?: MapComponent;
  /** whether the result came from a real LLM call */
  usedLLM?: boolean;
  /** raw JSON string returned by the model (for debugging the "toolcall") */
  raw?: string;
}

const MAP_SYNONYMS: Record<string, string> = {
  tree: 'tree',
  树: 'tree',
  树木: 'tree',
  flower: 'flower',
  花: 'flower',
  grass: 'grass',
  草: '草',
  house: 'house',
  房子: '房子',
  房屋: 'house',
  home: 'house',
};

function detectAssetKind(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [word, kind] of Object.entries(MAP_SYNONYMS)) {
    if (lower.includes(word.toLowerCase()) || text.includes(word)) return kind;
  }
  return undefined;
}

function cloneMap(m: MapComponent): MapComponent {
  return {
    ...m,
    terrain: { ...m.terrain, heights: [...m.terrain.heights] },
    water: { ...m.water },
    instances: m.instances.map((i) => ({ ...i, position: { ...i.position }, rotation: { ...i.rotation }, scale: { ...i.scale } })),
  };
}

function ruleBasedMap(prompt: string, ctx?: MapAgentContext): MapAgentResult {
  const map = ctx?.map ? cloneMap(ctx.map) : createEmptyMap();
  const kind = detectAssetKind(prompt);

  if (kind && ctx?.assets) {
    const asset =
      ctx.assets.find((a) => a.category === kind) ?? ctx.assets.find((a) => a.name.toLowerCase().includes(kind));
    if (asset) {
      const offset = (map.instances.length % 5) * 1.6 - 3.2;
      map.instances.push(createMapInstance(asset.id, vec3(offset, 0, offset), vec3(), vec3(1, 1, 1), asset.name));
      return { message: `已在地图中添加「${asset.name}」。启用 OpenAI 兼容接口后，即可用自然语言自由生成与修改地图。` , map };
    }
    return {
      message: `当前元件库中找不到「${kind}」类元件，无法放置。请先在元件库创建对应元件，再添加进地图。`,
    };
  }

  if (/(抬升|升高|抬高|raise|隆起|堆高|加高)/i.test(prompt)) {
    map.terrain.heights = map.terrain.heights.map((h) => h + 1);
    return { message: '已整体抬升地形（每个顶点 +1）。', map };
  }
  if (/(降低|下沉|下凹|lower|挖低|下陷)/i.test(prompt)) {
    map.terrain.heights = map.terrain.heights.map((h) => h - 1);
    return { message: '已整体降低地形（每个顶点 -1）。', map };
  }
  if (/(平整|压平|flatten|铲平)/i.test(prompt)) {
    map.terrain.heights = map.terrain.heights.map(() => 0);
    return { message: '已平整地形（高度归零）。', map };
  }
  if (/(加水|水域|水面|开启水域|enable water|add water|开[启]?水|显示水)/i.test(prompt)) {
    map.water.enabled = true;
    return { message: '已开启水域。', map };
  }
  if (/(去掉水|移除水|关闭水域|disable water|去水|隐藏水)/i.test(prompt)) {
    map.water.enabled = false;
    return { message: '已关闭水域。', map };
  }
  if (/(提升水位|水位升高|raise water|提高水面)/i.test(prompt)) {
    map.water.level += 1;
    map.water.enabled = true;
    return { message: '已提升水位（level +1）。', map };
  }

  return {
    message:
      '未启用 AI。当前仅支持：放树/花/草/房子（如“放一棵树”）、抬升/降低/平整地形、开启/关闭/提升水域。在「设置」中配置 OpenAI 兼容接口后，即可用自然语言自由生成与修改地图。',
  };
}

// ---- OpenAI-compatible generation (map schema) ----

const MAP_SCHEMA_HINT = `You are a 3D map modeling assistant for ShapeCraft. A map is a square-area scene described as JSON.

SCHEMA (strict JSON shape):
Map = {
  "name": string,
  "description": string,
  "size": number,
  "terrain": { "segments": number, "heights": number[] },
  "water": { "enabled": boolean, "level": number, "color": "#rrggbb" },
  "instances": [ MapInstance ]
}
MapInstance = {
  "assetId": string,
  "name": string | null,
  "position": {"x":number,"y":number,"z":number},
  "rotation": {"x":number,"y":number,"z":number},
  "scale": {"x":number,"y":number,"z":number}
}

TERRAIN:
- "segments" is the number of grid segments per side; the vertex count is (segments+1)^2.
- "heights" is a row-major array of vertex heights (length exactly (segments+1)^2). Index = j*(segments+1)+i for column i, row j.
- Keep heights reasonable (roughly -3..6) so the map stays editable.

WATER:
- "enabled": whether the water plane is shown. "level": world Y of the water surface. "color": hex.

INSTANCES:
- Each instance is a REFERENCE to an existing asset component (its "assetId"). Do NOT invent assetIds that do not exist; only reuse assetIds present in the current map's instances or the user's referenced assets.
- "position" is the world placement (x,z on the ground, y near the terrain height). "rotation" is Euler radians. "scale" is uniform-ish (use {1,1,1} unless asked).

GENERAL RULES:
- Always respond with ONLY the JSON object, no markdown or prose.
- When CREATING, return the COMPLETE Map.
- When MODIFYING an existing map, edit the provided JSON IN PLACE and return the COMPLETE updated Map.
- Follow the user's intent; you may add/remove/move instances and reshape terrain/water.
- Always reply in the SAME language as the user's request.
- ALWAYS write your conversational reply in your streamed TEXT (it is shown to the user live). Never put user-facing prose inside the tool arguments.

TOOL USAGE:
- Use the \`create_map\` tool ONLY for the structured map data.
- Set \`update: true\` whenever you actually create or modify a map. Set \`update: false\` when you need MORE information before making any change — then ask in the text reply and do NOT include a real map.`;

const MAP_TOOL = {
  type: 'function',
  function: {
    name: 'create_map',
    description: 'Build or modify a 3D map (square terrain, water, placed asset instances). Call whenever you actually create or change a map.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        update: {
          type: 'boolean',
          description: 'true when you create/modify the map and want it saved; false when you need more info first (nothing is saved).',
        },
        size: { type: 'number' },
        terrain: {
          type: 'object',
          properties: {
            segments: { type: 'number' },
            heights: { type: 'array', items: { type: 'number' } },
          },
          additionalProperties: true,
        },
        water: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            level: { type: 'number' },
            color: { type: 'string' },
          },
          additionalProperties: true,
        },
        instances: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              assetId: { type: 'string' },
              name: { type: 'string' },
              position: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } }, additionalProperties: true },
              rotation: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } }, additionalProperties: true },
              scale: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, z: { type: 'number' } }, additionalProperties: true },
            },
            additionalProperties: true,
          },
        },
      },
      required: ['name', 'update', 'terrain', 'water', 'instances'],
    },
  },
};

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && isFinite(v) ? v : fallback;
}
function vec(v: any, fx: number, fy: number, fz: number): Vec3 {
  return { x: num(v?.x, fx), y: num(v?.y, fy), z: num(v?.z, fz) };
}

/** Coerce arbitrary model output into a valid MapComponent. Regenerates ids. */
function sanitizeMap(p: any): MapComponent {
  const seg = Math.max(1, Math.floor(num(p?.terrain?.segments, 16)));
  const expected = (seg + 1) * (seg + 1);
  const rawH = Array.isArray(p?.terrain?.heights) ? p.terrain.heights : [];
  const heights: number[] = new Array(expected).fill(0);
  for (let i = 0; i < expected; i++) heights[i] = num(rawH[i], 0);

  const water = {
    enabled: p?.water?.enabled !== false,
    level: num(p?.water?.level, 0),
    color: typeof p?.water?.color === 'string' ? p.water.color : '#3a7bd5',
  };

  const instances = Array.isArray(p?.instances)
    ? p.instances.map((inst: any) => ({
        id: uid('mi'),
        assetId: typeof inst?.assetId === 'string' ? inst.assetId : '',
        name: typeof inst?.name === 'string' ? inst.name : undefined,
        position: vec(inst?.position, 0, 0, 0),
        rotation: vec(inst?.rotation, 0, 0, 0),
        scale: vec(inst?.scale, 1, 1, 1),
      }))
    : [];

  const now = new Date().toISOString();
  return {
    id: uid('map'),
    name: typeof p?.name === 'string' ? p.name : 'Map',
    description: typeof p?.description === 'string' ? p.description : '',
    size: num(p?.size, 20),
    terrain: { segments: seg, heights },
    water,
    instances,
    createdAt: now,
    updatedAt: now,
  };
}

function contextPayload(ctx?: MapAgentContext) {
  if (!ctx?.map) return null;
  const m = ctx.map;
  return {
    name: m.name,
    description: m.description,
    size: m.size,
    terrain: m.terrain,
    water: m.water,
    instances: m.instances,
  };
}

async function callLLMMap(prompt: string, ctx?: MapAgentContext, onProgress?: (text: string) => void): Promise<MapAgentResult> {
  const cfg = loadSettings();
  const url = `${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const current = contextPayload(ctx);
  const userContent = current
    ? `Current map (modify it as requested, return the FULL updated JSON):\n${JSON.stringify(current)}\n\nRequest: ${prompt}`
    : `Create a new 3D map for: ${prompt}`;

  const requestBody: Record<string, unknown> = {
    model: cfg.model,
    temperature: 0.6,
    stream: true,
    tools: [MAP_TOOL],
    tool_choice: 'auto',
    messages: [
      { role: 'system', content: MAP_SCHEMA_HINT },
      { role: 'user', content: userContent },
    ],
  };

  console.log('[map-agent] AI request ->', url, JSON.stringify(requestBody, null, 2));

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
    console.error('[map-agent] AI request failed', res.status, errText.slice(0, 200));
    throw new Error(`HTTP ${res.status} ${errText.slice(0, 120)}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let content = '';
  let toolArgs = '';
  let wireResponse = '';
  let lastShown = '';
  const show = (t: string) => {
    if (t && t !== lastShown) {
      lastShown = t;
      onProgress?.(t);
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
      wireResponse += data + '\n';
      let json: any;
      try {
        json = JSON.parse(data);
      } catch {
        continue;
      }
      const delta = json?.choices?.[0]?.delta ?? {};
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

  const raw: string = wireResponse.trim() || content || toolArgs;
  if (!raw) throw new Error('模型未返回任何内容');

  console.log('[map-agent] AI raw response ->', raw);

  if (!toolArgs) {
    const reply = content.trim();
    if (!reply) throw new Error('模型未返回任何内容');
    return { message: reply, usedLLM: true, raw };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(toolArgs);
  } catch {
    throw new Error(`模型未返回合法的 JSON（收到：${toolArgs.slice(0, 80)}）`);
  }

  const reply = content.trim() || (typeof parsed?.description === 'string' ? parsed.description.trim() : '');

  if (parsed?.update === false) {
    return { message: reply || '需要更多信息后再修改（未更新数据）。', usedLLM: true, raw };
  }

  const map = sanitizeMap(parsed);
  const modelMessage = reply || `已更新「${map.name}」`;
  return { message: modelMessage, map, usedLLM: true, raw };
}

/**
 * Chat agent entry point for maps. Uses the configured OpenAI-compatible provider
 * when enabled (and can modify the current map via context), otherwise falls back
 * to the built-in rule-based generator. Same contract shape as the asset agent.
 */
export async function runMapAgent(
  prompt: string,
  ctx?: MapAgentContext,
  onProgress?: (text: string) => void,
): Promise<MapAgentResult> {
  const cfg = loadSettings();
  if (!cfg.enabled || !cfg.apiKey) {
    return ruleBasedMap(prompt, ctx);
  }
  try {
    return await callLLMMap(prompt, ctx, onProgress);
  } catch (e) {
    return { message: `AI 调用失败：${(e as Error).message}`, usedLLM: true };
  }
}
