import { createStore } from 'zustand/vanilla';
import type { Viewport, TransformMode, TransformTarget } from './three-view';
import {
  type AssetComponent,
  type AssetPart,
  type AssetCategory,
  createPart,
  createEmptyAsset,
  defaultMaterial,
  uid,
  vec3,
} from '../schema';
import {
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  listAssets,
} from './api';
import { resolveRefs, buildInstanceReference, findPart, type RefMap } from './instance';
import { runAgent, verifyAsset } from './agent';
import { loadSettings } from './settings';

/**
 * Single shared editor store.
 *
 * This is the event-driven bridge between the Three.js canvas viewport and the
 * React UI. It is a module-level zustand vanilla store (a true singleton), so
 * the imperative `Viewport` can read/write it directly while React components
 * subscribe to it via `useStore` (see `editor-hooks.ts`). Every `set` notifies
 * all subscribers — that notification IS the event that re-renders React, and
 * the canvas receives the same change through the action that forwards it to
 * the `Viewport` instance.
 *
 * Data flow (bidirectional):
 *   - canvas → React: `Viewport` calls `onSelect` / `onTransform` (wired in
 *     `views/editor.ts`) → `selectPart` / `applyCanvasTransform` → store update
 *     → React re-renders.
 *   - React → canvas: a React panel calls an action (e.g. `setTransformMode`,
 *     `addPrimitive`, `updatePart`) → store update + the action forwards the
 *     change to the connected `Viewport` (e.g. `viewport.setTransformMode`).
 */
export type EditorTransformMode = TransformMode;

export interface EditorState {
  asset: AssetComponent | null;
  savedId: string | undefined;
  selectedPartId: string | null;
  transformMode: EditorTransformMode;
  /** When true, the scale gizmo scales all axes uniformly (lock aspect ratio). */
  lockScaleRatio: boolean;
  refAssets: AssetComponent[];
  chatBusy: boolean;
  saveState: string;
  /** Bumped on every asset-data mutation so React re-renders (data is mutated in place). */
  revision: number;
  /** Non-reactive handle to the mounted canvas viewport. */
  viewport: Viewport | null;
  dimensionUpdater: ((d: { x: number; y: number; z: number }) => void) | null;

  // lifecycle
  setViewport: (vp: Viewport | null) => void;
  setDimensionUpdater: (fn: ((d: { x: number; y: number; z: number }) => void) | null) => void;
  loadAsset: (id?: string) => Promise<void>;
  resetEditor: () => void;

  // selection / transform (bidirectional)
  selectPart: (id: string | null) => void;
  setTransformMode: (m: EditorTransformMode) => void;
  setLockScaleRatio: (lock: boolean) => void;
  applyCanvasTransform: (id: string, t: TransformTarget) => void;

  // mutations
  addPrimitive: (shape: AssetPart['shape']) => void;
  insertReference: (refId: string) => void;
  updatePart: (id: string, mutate: (p: AssetPart) => void) => void;
  removePart: (id: string) => void;
  refresh: () => Promise<void>;
  setName: (name: string) => void;
  setCategory: (c: AssetCategory) => void;

  // references
  populateRefs: () => Promise<void>;
  captureShot: () => Promise<void>;

  // scripts
  addScript: (partId: string) => void;
  updateScript: (slotId: string, code: string, name: string) => void;
  removeScript: (slotId: string) => void;
  applyScripts: () => void;

  // persistence
  save: () => Promise<'created' | 'updated' | 'failed'>;
  remove: () => Promise<void>;

  // chat / agent
  agentTurn: (text: string, onProgress?: (t: string) => void) => Promise<void>;
}

const STARTER_SCRIPT = `// Unity-style: called every frame.
// t = total seconds, dt = frame delta.
// self = this part, scene = asset root, THREE = three.js
function update(t, dt) {
  self.rotation.y += dt;
}
`;

function removePartFromTree(node: AssetPart, id: string): boolean {
  const idx = node.children.findIndex((c) => c.id === id);
  if (idx !== -1) {
    node.children.splice(idx, 1);
    return true;
  }
  for (const c of node.children) {
    if (removePartFromTree(c, id)) return true;
  }
  return false;
}

function inputOf(asset: AssetComponent) {
  return {
    name: asset.name,
    category: asset.category,
    description: asset.description,
    root: asset.root,
    thumbnail: asset.thumbnail,
    scripts: asset.scripts,
  };
}

export const editorStore = createStore<EditorState>((set, get) => ({
  asset: null,
  savedId: undefined,
  selectedPartId: null,
  transformMode: 'translate',
  lockScaleRatio: true,
  refAssets: [],
  chatBusy: false,
  saveState: '',
  revision: 0,
  viewport: null,
  dimensionUpdater: null,

  setViewport: (vp) => {
    set({ viewport: vp });
    vp?.setLockRatio(get().lockScaleRatio);
  },
  setDimensionUpdater: (fn) => set({ dimensionUpdater: fn }),

  resetEditor: () =>
    set({
      viewport: null,
      dimensionUpdater: null,
      asset: null,
      savedId: undefined,
      selectedPartId: null,
      refAssets: [],
      chatBusy: false,
      saveState: '',
    }),

  loadAsset: async (id) => {
    let asset: AssetComponent;
    if (id) {
      const existing = await getAsset(id);
      if (!existing) {
        set({ asset: null, savedId: id, saveState: '未找到该元件。', revision: get().revision + 1 });
        return;
      }
      asset = existing;
    } else {
      asset = createEmptyAsset('Untitled', 'other');
    }
    set({
      asset,
      savedId: id,
      refAssets: [],
      chatBusy: false,
      saveState: '',
      revision: get().revision + 1,
    });
    await get().populateRefs();
    await get().refresh();
  },

  // ---- canvas → React (and React → canvas) ----
  selectPart: (id) => {
    set({ selectedPartId: id });
    get().viewport?.setSelected(id);
  },

  setTransformMode: (m) => {
    set({ transformMode: m });
    get().viewport?.setTransformMode(m);
  },

  setLockScaleRatio: (lock) => {
    set({ lockScaleRatio: lock });
    get().viewport?.setLockRatio(lock);
  },

  applyCanvasTransform: (id, t) => {
    const asset = get().asset;
    if (!asset) return;
    const part = findPart(asset.root, id);
    if (!part) return;
    part.position = t.position;
    part.rotation = t.rotation;
    part.scale = t.scale;
    // Mutated in place → bump revision so React inspector re-renders. The
    // on-screen gizmo already moved the object, so we do NOT rebuild the scene.
    set((s) => ({ revision: s.revision + 1 }));
  },

  // ---- React → canvas ----
  addPrimitive: (shape) => {
    const { asset, selectedPartId } = get();
    if (!asset) return;
    let parent = (selectedPartId && findPart(asset.root, selectedPartId)) || asset.root;
    // Never nest edits inside a locked instance — fall back to the root.
    if (parent.shape === 'instance') parent = asset.root;
    const isNode = shape === 'node';
    const part = createPart({
      shape,
      name: isNode
        ? `Node ${parent.children.length + 1}`
        : `${shape[0].toUpperCase()}${shape.slice(1)} ${parent.children.length + 1}`,
      material: defaultMaterial(shape === 'sphere' || shape === 'cone' ? '#4caf50' : '#cccccc'),
      size:
        shape === 'box'
          ? vec3(0.6, 0.6, 0.6)
          : shape === 'sphere'
            ? vec3(0.4, 0.4, 0.4)
            : shape === 'plane'
              ? vec3(1, 1, 1)
              : vec3(0.3, 0.8, 0.3),
      position: vec3(0, isNode ? 0 : shape === 'cylinder' || shape === 'cone' ? 0.4 : 0.3, 0),
    });
    parent.children.push(part);
    get().selectPart(part.id);
    void get().refresh();
  },

  insertReference: (refId) => {
    const { asset, selectedPartId, refAssets } = get();
    if (!asset || !refId) return;
    const inst = buildInstanceReference({
      root: asset.root,
      selectedId: selectedPartId,
      refId,
      refName: refAssets.find((a) => a.id === refId)?.name ?? 'Instance',
    });
    get().selectPart(inst.id);
    void get().refresh();
  },

  updatePart: (id, mutate) => {
    const asset = get().asset;
    if (!asset) return;
    const part = findPart(asset.root, id);
    if (!part) return;
    mutate(part);
    set((s) => ({ revision: s.revision + 1 }));
    void get().refresh();
  },

  removePart: (id) => {
    const { asset, selectedPartId } = get();
    if (!asset) return;
    if (!removePartFromTree(asset.root, id)) return;
    if (selectedPartId === id) set({ selectedPartId: null });
    set((s) => ({ revision: s.revision + 1 }));
    void get().refresh();
  },

  refresh: async () => {
    const { asset, viewport } = get();
    if (!asset || !viewport) return;
    const refs: RefMap = await resolveRefs(asset.root);
    viewport.setRoot(asset.root, (id) => refs.get(id) ?? null);
    const sel = get().selectedPartId;
    if (sel) viewport.setSelected(sel);
    viewport.setScripts(asset.scripts);
    get().dimensionUpdater?.(viewport.getDimensions());
    set((s) => ({ revision: s.revision + 1 }));
  },

  setName: (name) => {
    const asset = get().asset;
    if (!asset) return;
    asset.name = name;
    set((s) => ({ revision: s.revision + 1 }));
  },

  setCategory: (c) => {
    const asset = get().asset;
    if (!asset) return;
    asset.category = c;
    set((s) => ({ revision: s.revision + 1 }));
  },

  populateRefs: async () => {
    const { savedId } = get();
    const all = await listAssets();
    set({ refAssets: all.filter((a) => a.id !== savedId) });
  },

  captureShot: async () => {
    const { asset, savedId, viewport } = get();
    if (!asset || !viewport) return;
    asset.thumbnail = viewport.captureThumbnail();
    set((s) => ({ revision: s.revision + 1 }));
    if (savedId) {
      try {
        await updateAsset(savedId, inputOf(asset));
        set({ saveState: '已截图并保存 ✓' });
      } catch (e) {
        set({ saveState: '截图保存失败：' + (e as Error).message });
      }
    } else {
      set({ saveState: '已截图（保存后将按当前视图刷新）' });
    }
  },

  addScript: (partId) => {
    const asset = get().asset;
    if (!asset) return;
    asset.scripts = asset.scripts ?? [];
    asset.scripts.push({ id: uid(), partId, name: 'Script', code: STARTER_SCRIPT });
    get().viewport?.setScripts(asset.scripts);
    set((s) => ({ revision: s.revision + 1 }));
  },

  updateScript: (slotId, code, name) => {
    const asset = get().asset;
    if (!asset || !asset.scripts) return;
    const s = asset.scripts.find((x) => x.id === slotId);
    if (!s) return;
    s.code = code;
    s.name = name;
    set((st) => ({ revision: st.revision + 1 }));
  },

  removeScript: (slotId) => {
    const asset = get().asset;
    if (!asset) return;
    asset.scripts = (asset.scripts ?? []).filter((s) => s.id !== slotId);
    get().viewport?.setScripts(asset.scripts);
    set((s) => ({ revision: s.revision + 1 }));
  },

  applyScripts: () => {
    const asset = get().asset;
    get().viewport?.setScripts(asset?.scripts);
  },

  save: async () => {
    const { asset, savedId, viewport } = get();
    if (!asset) return 'failed';
    asset.thumbnail = viewport?.captureThumbnail() ?? asset.thumbnail;
    try {
      if (savedId) {
        await updateAsset(savedId, inputOf(asset));
        set({ saveState: '已保存 ✓' });
        return 'updated';
      }
      const created = await createAsset(inputOf(asset));
      asset.id = created.id;
      asset.createdAt = created.updatedAt;
      asset.updatedAt = created.updatedAt;
      set({ savedId: created.id });
      await get().populateRefs();
      set({ saveState: '已保存 ✓' });
      return 'created';
    } catch (e) {
      set({ saveState: '保存失败：' + (e as Error).message });
      return 'failed';
    }
  },

  remove: async () => {
    const { savedId } = get();
    if (!savedId) return;
    if (confirm('确定删除该元件？')) {
      await deleteAsset(savedId);
      location.hash = '#/library';
    }
  },

  agentTurn: async (text, onProgress) => {
    const { asset, selectedPartId, savedId, viewport } = get();
    if (!asset) return;
    set({ chatBusy: true });
    try {
      const result = await runAgent(text, { asset, selectedId: selectedPartId, isNew: !savedId }, onProgress);
      if (result.asset) {
        const MAX_VERIFY_ROUNDS = 3;
        let round = 0;
        let next: AssetComponent | undefined = result.asset;
        while (next) {
          const a = next;
          set((s) => ({ asset: a, revision: s.revision + 1 }));
          const status = await get().save();
          set({
            saveState:
              status === 'failed'
                ? 'AI 结果已载入，但自动保存失败（可手动保存）'
                : 'AI 已修改并保存 ✓',
          });
          await get().refresh();
          if (round >= MAX_VERIFY_ROUNDS) break;
          round++;
          const cfg = loadSettings();
          if (!cfg.enabled || !cfg.apiKey) break;
          if (!cfg.supportsVision) break;
          const img = viewport?.captureThumbnail();
          if (!img) break;
          const v = await verifyAsset(a, img, onProgress);
          next = v.asset;
          if (!next) break;
        }
      }
    } finally {
      set({ chatBusy: false });
    }
  },
}));
