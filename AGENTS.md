# AGENTS.md — ShapeCraft

AI 驱动的 3D 世界与多人游戏创作平台。**当前阶段（Phase 1）只开放“元件库 / 元件编辑器”**，其余模块（世界编辑、多人运行、版本发布、外部 AI Agent）暂为 `Coming soon`。

## 技术栈（命令初始化，勿手改 lockfile 之外的脚手架）

- 包管理：**pnpm workspace** monorepo（`pnpm-workspace.yaml`）
- 前端：`apps/web` — Vite + TypeScript + Three.js
- 后端：`services/api` — Moleculer + moleculer-web（HTTP 网关），数据持久化到 JSON 文件
- 共享类型：`packages/schema` — 元件（Asset / Prefab）领域模型与预设模板

> 运行环境需 Node ≥ 20.19（本机 conda 默认 Node 18 过旧，请使用 nvm 的 Node 22：`export PATH="$HOME/.nvm/versions/node/v22.13.0/bin:$PATH"`）。

## 常用命令

```bash
pnpm install                 # 安装全部 workspace 依赖
pnpm --filter @shape-craft/web dev      # 前端 http://localhost:5173
pnpm --filter @shape-craft/api dev      # 后端 http://localhost:3000/api
pnpm -r typecheck            # 全量类型检查
pnpm --filter @shape-craft/web build    # 前端构建
```

## 目录约定

```
apps/web/src/
  main.ts            # hash 路由 (#/ 首页, #/library 元件库, #/editor/:id 编辑器)
  lib/api.ts         # 数据层：优先调用后端 API，失败回退 localStorage
  lib/three-view.ts  # Three.js 视口（构建场景、选择、截图）
  lib/agent.ts       # 规则型聊天 Agent（本地解析，可替换为真实 LLM）
  lib/templates.ts   # 由 schema 再导出的 树/花/草/房子 预设
  views/             # home / library / editor 视图
packages/schema/src/
  index.ts           # AssetPart / AssetComponent 类型 + 构造工具
  templates.ts       # buildTree/buildFlower/buildGrass/buildHouse
services/api/src/
  index.ts           # Moleculer broker + REST 网关 (/api/assets)
  asset.service.ts   # CRUD 动作 + JSON 文件持久化
```

## 数据模型（稳定契约）

- `AssetComponent`：一个元件 prefab（id, name, category, description, root, timestamps, thumbnail）。
- `AssetPart`：基础形状节点（box/sphere/cylinder/cone/plane），含 size/position/rotation/scale/material + children（层级）。
- 前端与后端共享同一份 `@shape-craft/schema`，**新增字段请保持向后兼容**。

## REST API（Moleculer gateway, `/api`）

| Method | Path | Action |
| ------ | ---- | ------ |
| GET | `/assets` | 列表 |
| GET | `/assets/:id` | 详情 |
| POST | `/assets` | 创建 |
| PUT | `/assets/:id` | 更新 |
| DELETE | `/assets/:id` | 删除 |

前端 `lib/api.ts` 已实现“API 优先、localStorage 回退”，因此**后端未启动时编辑器仍可用**。

## 扩展指引（给后续 Agent）

1. 新增元件种类：在 `packages/schema/src/templates.ts` 加生成函数，并在 `PREFAB_TEMPLATES` 注册。
2. 新增基础形状：在 `AssetPart.shape` 联合类型 + `apps/web/src/lib/scene-graph.ts` 的 `geometryFor` 同步支持（`node`/`instance` 不生成网格）。新增 `instance` 形状时还需在 `scene-graph.ts` 的 `buildPartObject` 提供 `resolve(refId)` 引用解析与整体锁定逻辑，并在编辑器/角色视图加入「插入引用」入口。
3. 接入真实 AI：`apps/web/src/lib/settings.ts` 持久化 OpenAI 兼容配置（key / model / baseUrl / enabled），在 `#/settings` 页面配置；`lib/agent.ts` 的 `runAgent(prompt, ctx)` 在启用时把**当前元件**作为上下文传给 `${baseUrl}/chat/completions`，让模型直接修改/新增部件并回传完整 JSON（含 `sanitizePart` 校验），编辑器在收到结果后自动保存（创建或更新）。未配置 / 调用失败时回退规则生成，规则生成也支持“添加叶子 / 加一扇门”等对当前元件的增量修改。保持 `AgentResult { message, asset?, usedLLM? }` 契约即可，无需改动 UI。
4. 世界编辑器 / 多人运行 / 发布：在 `services/api` 增加对应 service，前端新增路由视图，保持现有分层。

## 约定

- 代码用 TypeScript，开启 `strict` / `noUnusedLocals`。
- 不要向仓库提交密钥；后端持久化文件 `services/api/data/*.json` 已 gitignore（如有需要）。
- UI 文案中英双语，按钮/标题保持简洁。
