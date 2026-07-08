#!/usr/bin/env bash
# Reproduces EXACTLY the request the app sends from callLLM():
#   POST {baseUrl}/chat/completions
#   body: { model, temperature:0.6, response_format:{type:"json_object"},
#           messages:[ system(SCHEMA_HINT), assistant(EXAMPLE), user(CURRENT+request) ] }
#
# Usage:
#   OPENAI_API_KEY=sk-... ./scripts/ai-curl.sh "把叶子改成大片"
#   OPENAI_API_KEY=sk-... OPENAI_MODEL=gpt-4o-mini ./scripts/ai-curl.sh "造一棵樱花树"
set -euo pipefail

KEY="${OPENAI_API_KEY:?请设置 OPENAI_API_KEY}"
MODEL="${OPENAI_MODEL:-gpt-4o-mini}"
BASE="${OPENAI_BASE_URL:-https://api.openai.com/v1}"
BASE="${BASE%/}"

SYS=$(cat <<'SYS'
You are a 3D modeling assistant for ShapeCraft. A component is a JSON tree of primitive parts.

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
SYS
)

EXAMPLE='{"name":"Oak Tree","category":"tree","description":"A stylized tree with a brown trunk and flat triangular green leaves.","root":{"name":"Tree","shape":"box","size":{"x":0.01,"y":0.01,"z":0.01},"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":1,"y":1,"z":1},"material":{"color":"#000000","roughness":0.8,"metalness":0.05},"children":[{"name":"Trunk","shape":"cylinder","size":{"x":0.18,"y":1.2,"z":0.18},"position":{"x":0,"y":0.6,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":1,"y":1,"z":1},"material":{"color":"#7a4f2a","roughness":0.9,"metalness":0},"children":[]},{"name":"Leaves","shape":"box","size":{"x":0.01,"y":0.01,"z":0.01},"position":{"x":0,"y":1.6,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":1,"y":1,"z":1},"material":{"color":"#000000","roughness":0.8,"metalness":0.05},"children":[{"name":"Leaf1","shape":"triangle","size":{"x":0.35,"y":0.5,"z":0.01},"position":{"x":0.4,"y":0.1,"z":0},"rotation":{"x":0,"y":0,"z":1.2},"scale":{"x":1,"y":1,"z":1},"material":{"color":"#3f8f3a","roughness":0.8,"metalness":0.05},"children":[]},{"name":"Leaf2","shape":"triangle","size":{"x":0.35,"y":0.5,"z":0.01},"position":{"x":-0.4,"y":0.1,"z":0},"rotation":{"x":0,"y":0,"z":-1.2},"scale":{"x":1,"y":1,"z":1},"material":{"color":"#4caf50","roughness":0.8,"metalness":0.05},"children":[]},{"name":"Leaf3","shape":"triangle","size":{"x":0.35,"y":0.5,"z":0.01},"position":{"x":0,"y":0.2,"z":0.4},"rotation":{"x":1.2,"y":0,"z":0},"scale":{"x":1,"y":1,"z":1},"material":{"color":"#4caf50","roughness":0.8,"metalness":0.05},"children":[]}]}]}}'

# Sample "current" component (a tree with cone foliage) to exercise an in-place MODIFY.
CURRENT='{"name":"Sample Tree","category":"tree","description":"A small stylized tree.","root":{"name":"Tree","shape":"box","size":{"x":0.01,"y":0.01,"z":0.01},"position":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":1,"y":1,"z":1},"material":{"color":"#000000","roughness":0.8,"metalness":0.05},"children":[{"name":"Trunk","shape":"cylinder","size":{"x":0.18,"y":1.2,"z":0.18},"position":{"x":0,"y":0.6,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":1,"y":1,"z":1},"material":{"color":"#7a4f2a","roughness":0.9,"metalness":0},"children":[]},{"name":"Foliage","shape":"cone","size":{"x":0.9,"y":1.1,"z":0.9},"position":{"x":0,"y":1.7,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":1,"y":1,"z":1},"material":{"color":"#3f8f3a","roughness":0.85,"metalness":0.05},"children":[]}]}}'

REQ="${1:-把叶子改成大片}"

jq -n \
  --arg sys "$SYS" \
  --argjson ex "$EXAMPLE" \
  --argjson cur "$CURRENT" \
  --arg req "$REQ" \
  --arg model "$MODEL" \
  '{
    model: $model,
    temperature: 0.6,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: $sys },
      { role: "assistant", content: ("Understood. Here is an example component in the expected format:\n" + ($ex | tostring)) },
      { role: "user", content: ("Current component (modify it as requested, return the FULL updated JSON):\n" + ($cur | tostring) + "\n\nRequest: " + $req) }
    ]
  }' > /tmp/ai-curl-request.json

echo "=== REQUEST ($(wc -c < /tmp/ai-curl-request.json) bytes) ==="
cat /tmp/ai-curl-request.json

echo
echo "=== RESPONSE ==="
curl -sS "$BASE/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $KEY" \
  --data @/tmp/ai-curl-request.json
echo
