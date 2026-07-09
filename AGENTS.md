# AGENTS.md — ShapeCraft

AI 驱动的 3D 世界与多人游戏创作平台。**当前阶段（Phase 1）只开放“元件库 / 元件编辑器”**，其余模块（世界编辑、多人运行、版本发布、外部 AI Agent）暂为 `Coming soon`。

## 技术栈（命令初始化，勿手改 lockfile 之外的脚手架）

- 包管理：**pnpm**（单包项目，仓库根目录即前端项目根目录）
- 前端：Vite + TypeScript + Three.js（根目录 `src/`）
- 领域模型：`src/schema` — 原 `@shape-craft/schema` 包已内联到前端（元件 / Prefab / 角色 / 地图 / 场景 领域模型与预设模板）

> 运行环境需 Node ≥ 20.19（本机 conda 默认 Node 18 过旧，请使用 nvm 的 Node 22：`export PATH="$HOME/.nvm/versions/node/v22.13.0/bin:$PATH"`）。

## 常用命令

```bash
pnpm install                 # 安装依赖
pnpm dev                     # 前端 http://localhost:5173
pnpm build                   # 类型检查 + 构建
pnpm typecheck               # 类型检查
```

## 目录约定

```
src/
  main.ts            # hash 路由 (#/ 首页, #/library 元件库, #/editor/:id 编辑器)
  lib/api.ts         # 数据层：localStorage 持久化（后端已移除，纯前端）
  lib/three-view.ts  # Three.js 视口（构建场景、选择、截图）
  lib/agent.ts       # 规则型聊天 Agent（本地解析，可替换为真实 LLM）
  lib/templates.ts   # 由 schema 再导出的 树/花/草/房子 预设
  views/             # home / library / editor 视图
  schema/
    index.ts         # AssetPart / AssetComponent 类型 + 构造工具
    templates.ts     # buildTree/buildFlower/buildGrass/buildHouse
```

## 数据模型（稳定契约）

- `AssetComponent`：一个元件 prefab（id, name, category, description, root, timestamps, thumbnail）。
- `AssetPart`：基础形状节点（box/sphere/cylinder/cone/plane），含 size/position/rotation/scale/material + children（层级）。
- 领域模型内联在 `src/schema`，**新增字段请保持向后兼容**。

## 扩展指引（给后续 Agent）

1. 新增元件种类：在 `src/schema/templates.ts` 加生成函数，并在 `PREFAB_TEMPLATES` 注册。
2. 新增基础形状：在 `AssetPart.shape` 联合类型 + `src/lib/scene-graph.ts` 的 `geometryFor` 同步支持（`node`/`instance` 不生成网格）。新增 `instance` 形状时还需在 `scene-graph.ts` 的 `buildPartObject` 提供 `resolve(refId)` 引用解析与整体锁定逻辑，并在编辑器/角色视图加入「插入引用」入口。
3. 接入真实 AI：`src/lib/settings.ts` 持久化 OpenAI 兼容配置（key / model / baseUrl / enabled），在 `#/settings` 页面配置；`lib/agent.ts` 的 `runAgent(prompt, ctx)` 在启用时把**当前元件**作为上下文传给 `${baseUrl}/chat/completions`，让模型直接修改/新增部件并回传完整 JSON（含 `sanitizePart` 校验），编辑器在收到结果后自动保存（创建或更新）。未配置 / 调用失败时回退规则生成，规则生成也支持“添加叶子 / 加一扇门”等对当前元件的增量修改。保持 `AgentResult { message, asset?, usedLLM? }` 契约即可，无需改动 UI。

## 约定

- 代码用 TypeScript，开启 `strict` / `noUnusedLocals`。
- 不要向仓库提交密钥。
- UI 文案中英双语，按钮/标题保持简洁。
