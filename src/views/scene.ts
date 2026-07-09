import {
  type SceneComponent,
  type SceneObject,
  type AssetComponent,
  createEmptyScene,
} from '../schema';
import { SceneViewport, type SceneMode, type TerrainTool } from '../lib/scene-view.ts';
import {
  listScenes,
  getScene,
  createScene,
  updateScene,
  deleteScene,
} from '../lib/scene-api.ts';
import { listAssets } from '../lib/api.ts';

export async function renderScene(root: HTMLElement, id?: string) {
  const wrap = document.createElement('div');
  wrap.className = 'scene-page';
  root.appendChild(wrap);

  // ---- Layout ----
  const layout = document.createElement('div');
  layout.className = 'editor-layout scene-layout';

  const left = document.createElement('div');
  left.className = 'panel scene-list';
  const center = document.createElement('div');
  center.className = 'panel viewport-panel';
  const right = document.createElement('div');
  right.className = 'panel inspector';

  layout.append(left, center, right);
  wrap.appendChild(layout);

  // ---- Center: mode tabs + toolbar + viewport ----
  const tabs = document.createElement('div');
  tabs.className = 'mode-tabs';
  tabs.innerHTML = `
    <button class="tab active" data-mode="terrain">⛰️ 地形 Terrain</button>
    <button class="tab" data-mode="object">📦 物件 Object</button>
  `;
  center.appendChild(tabs);

  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar scene-toolbar';
  center.appendChild(toolbar);

  const viewportHost = document.createElement('div');
  viewportHost.className = 'viewport-host';
  center.appendChild(viewportHost);

  const viewport = new SceneViewport(viewportHost, {
    onTerrainChange: () => markDirty('地形已修改'),
    onObjectAdd: () => markDirty('已放置物件'),
    onObjectChange: () => markDirty('物件已移动'),
    onSelect: (oid) => renderInspector(oid),
  });
  (root as HTMLElement & { __dispose?: () => void }).__dispose = () => {
    try {
      viewport.dispose();
    } catch {
      /* already torn down */
    }
  };

  // ---- Top bar ----
  const topbar = document.createElement('div');
  topbar.className = 'editor-topbar';
  topbar.innerHTML = `
    <a class="btn small" href="#/scenes">← 返回</a>
    <input class="name-input" type="text" value="Untitled Scene" />
    <button class="btn primary" data-save>保存</button>
    <span class="save-state"></span>
  `;
  wrap.insertBefore(topbar, layout);

  // ---- State ----
  let scene: SceneComponent = createEmptyScene();
  let savedId: string | undefined = id;
  let dirty = false;
  let assets: AssetComponent[] = [];

  window.addEventListener('beforeunload', (e) => {
    if (dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  function markDirty(msg: string) {
    dirty = true;
    setSaveState(msg + '（未保存）');
  }
  function setSaveState(text: string) {
    (topbar.querySelector('.save-state') as HTMLElement).textContent = text;
  }

  // ---- Left: scene list ----
  async function renderSceneList() {
    const scenes = await listScenes();
    left.innerHTML = '<h4>场景 Scenes</h4>';
    const newBtn = document.createElement('button');
    newBtn.className = 'btn small full';
    newBtn.textContent = '+ 新建场景';
    newBtn.addEventListener('click', () => {
      savedId = undefined;
      scene = createEmptyScene();
      (topbar.querySelector('.name-input') as HTMLInputElement).value = scene.name;
      dirty = false;
      setSaveState('');
      void viewport.setScene(scene, assets);
      renderInspector(null);
    });
    left.appendChild(newBtn);
    const list = document.createElement('div');
    list.className = 'scene-items';
    for (const s of scenes) {
      const item = document.createElement('div');
      item.className = 'scene-item' + (s.id === savedId ? ' active' : '');
      item.innerHTML = `<span class="sname">${s.name}</span><button class="sdel" title="删除">×</button>`;
      item.addEventListener('click', async (e) => {
        if ((e.target as HTMLElement).classList.contains('sdel')) {
          if (confirm(`删除场景「${s.name}」？`)) {
            await deleteScene(s.id);
            if (savedId === s.id) savedId = undefined;
            renderSceneList();
          }
          return;
        }
        await loadScene(s.id);
      });
      list.appendChild(item);
    }
    left.appendChild(list);
  }

  async function loadScene(sid: string) {
    const s = await getScene(sid);
    if (!s) return;
    savedId = sid;
    scene = s;
    (topbar.querySelector('.name-input') as HTMLInputElement).value = scene.name;
    dirty = false;
    setSaveState('');
    await viewport.setScene(scene, assets);
    renderInspector(null);
    renderSceneList();
  }

  // ---- Toolbars (per mode) ----
  function renderTerrainToolbar() {
    toolbar.innerHTML = `
      <span class="muted">笔刷：</span>
      <button class="btn small mode active" data-tool="raise">抬高 ▲</button>
      <button class="btn small mode" data-tool="lower">降低 ▼</button>
      <button class="btn small mode" data-tool="flatten">平整 ⬌</button>
      <span class="sep"></span>
      <span class="muted">水体：</span>
      <button class="btn small mode" data-tool="water">💧 注水</button>
      <button class="btn small mode" data-tool="dry">🚫 排水</button>
      <span class="sep"></span>
      <label class="field inline">半径 <input type="range" min="1" max="10" step="0.5" value="3" data-brush-size /><span data-brush-size-v>3</span></label>
      <label class="field inline">强度 <input type="range" min="0.1" max="2" step="0.1" value="0.6" data-brush-strength /><span data-brush-strength-v>0.6</span></label>
      <span class="sep"></span>
      <label class="field inline">水位 <input type="range" min="${-scene.size / 2}" max="${scene.size / 2}" step="0.1" value="${scene.waterLevel}" data-water /><span data-water-v>${scene.waterLevel.toFixed(1)}</span></label>
      <span class="sep"></span>
      <button class="btn small danger" data-reset>重置地形</button>
    `;
    toolbar.querySelectorAll('[data-tool]').forEach((b) =>
      b.addEventListener('click', () => {
        const tool = (b as HTMLElement).getAttribute('data-tool') as TerrainTool;
        viewport.setTerrainTool(tool);
        toolbar.querySelectorAll('[data-tool]').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
      }),
    );
    const bs = toolbar.querySelector('[data-brush-size]') as HTMLInputElement;
    const bsv = toolbar.querySelector('[data-brush-size-v]') as HTMLElement;
    bs.addEventListener('input', () => {
      bsv.textContent = bs.value;
      applyBrush();
    });
    const bst = toolbar.querySelector('[data-brush-strength]') as HTMLInputElement;
    const bstv = toolbar.querySelector('[data-brush-strength-v]') as HTMLElement;
    bst.addEventListener('input', () => {
      bstv.textContent = bst.value;
      applyBrush();
    });
    const water = toolbar.querySelector('[data-water]') as HTMLInputElement;
    const wv = toolbar.querySelector('[data-water-v]') as HTMLElement;
    water.addEventListener('input', () => {
      wv.textContent = parseFloat(water.value).toFixed(1);
      viewport.setWaterLevel(parseFloat(water.value));
      markDirty('水位已调整');
    });
    toolbar.querySelector('[data-reset]')!.addEventListener('click', () => {
      scene.terrain.heights = scene.terrain.heights.map(() => 0);
      scene.terrain.water = scene.terrain.water.map(() => 0);
      void viewport.setScene(scene, assets);
      markDirty('地形已重置');
    });
    applyBrush();
  }

  function applyBrush() {
    const size = parseFloat((toolbar.querySelector('[data-brush-size]') as HTMLInputElement).value);
    const strength = parseFloat(
      (toolbar.querySelector('[data-brush-strength]') as HTMLInputElement).value,
    );
    viewport.setBrush(size, strength);
  }

  async function renderObjectToolbar() {
    toolbar.innerHTML = `
      <span class="muted">放置元件：</span>
      <select class="asset-select" data-asset><option value="">选择元件…</option></select>
      <button class="btn small primary" data-place>放置（点击地形）</button>
      <span class="sep"></span>
      <span class="muted">变换：</span>
      <button class="btn small mode active" data-xmode="translate">移动</button>
      <button class="btn small mode" data-xmode="rotate">旋转</button>
      <button class="btn small mode" data-xmode="scale">缩放</button>
      <span class="sep"></span>
      <button class="btn small danger" data-del-obj>删除选中</button>
    `;
    const sel = toolbar.querySelector('[data-asset]') as HTMLSelectElement;
    sel.innerHTML =
      '<option value="">选择元件…</option>' +
      assets
        .map((a) => `<option value="${a.id}">${a.name} · ${a.category}</option>`)
        .join('');
    sel.addEventListener('change', () => {
      viewport.armPlacement(sel.value || null);
    });
    toolbar.querySelector('[data-place]')!.addEventListener('click', () => {
      if (sel.value) viewport.armPlacement(sel.value);
    });
    toolbar.querySelectorAll('[data-xmode]').forEach((b) =>
      b.addEventListener('click', () => {
        viewport.setTransformMode((b as HTMLElement).getAttribute('data-xmode') as never);
        toolbar.querySelectorAll('[data-xmode]').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
      }),
    );
    toolbar.querySelector('[data-del-obj]')!.addEventListener('click', () => {
      viewport.deleteSelected();
      markDirty('已删除物件');
      renderInspector(null);
    });
  }

  tabs.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest('.tab') as HTMLElement | null;
    if (!tab) return;
    const mode = tab.getAttribute('data-mode') as SceneMode;
    tabs.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    viewport.setMode(mode);
    if (mode === 'terrain') renderTerrainToolbar();
    else void renderObjectToolbar();
  });

  // ---- Right inspector ----
  function renderInspector(selectedId: string | null) {
    right.innerHTML = '<h4>属性 Inspector</h4><div class="inspector-body"></div>';
    const body = right.querySelector('.inspector-body') as HTMLElement;
    if (selectedId) {
      const obj = scene.objects.find((o) => o.id === selectedId);
      if (obj) body.appendChild(objectForm(obj));
      return;
    }
    if (viewport.getMode() === 'object') {
      body.innerHTML = '<p class="muted">选择「放置」后点击地形放置元件；点击已放置的元件可在此调整变换。</p>';
    } else {
      body.innerHTML =
        '<p class="muted">地形模式：左键拖动笔刷抬高/降低地形，右键拖动旋转视角，滚轮缩放。用「注水/排水」笔刷在地形上画局部河流与池塘，用水位滑块控制全局水面高度。</p>';
    }
  }

  function numField(label: string, value: number, on: (v: number) => void): HTMLElement {
    const w = document.createElement('label');
    w.className = 'field';
    w.innerHTML = `<span>${label}</span>`;
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.step = '0.1';
    inp.value = String(value);
    inp.addEventListener('input', () => on(parseFloat(inp.value) || 0));
    w.appendChild(inp);
    return w;
  }

  function objectForm(obj: SceneObject): HTMLElement {
    const form = document.createElement('div');
    form.className = 'inspector-form';
    const title = document.createElement('div');
    title.className = 'group-title';
    title.textContent = `物件：${obj.name}`;
    form.appendChild(title);
    const axes: Array<'x' | 'y' | 'z'> = ['x', 'y', 'z'];
    const addVec = (title: string, v: typeof obj.position, set: (nv: typeof v) => void) => {
      const g = document.createElement('div');
      g.className = 'group';
      g.innerHTML = `<div class="group-title">${title}</div>`;
      const box = document.createElement('div');
      box.className = 'vec3';
      axes.forEach((ax, i) => {
        box.appendChild(
          numField(['X', 'Y', 'Z'][i], v[ax], (val) => {
            set({ ...v, [ax]: val });
            syncObject(obj);
          }),
        );
      });
      g.appendChild(box);
      form.appendChild(g);
    };
    addVec('位置 Position', obj.position, (nv) => (obj.position = nv));
    addVec('旋转 Rotation (rad)', obj.rotation, (nv) => (obj.rotation = nv));
    addVec('缩放 Scale', obj.scale, (nv) => (obj.scale = nv));
    return form;
  }

  function syncObject(obj: SceneObject) {
    viewport.syncTransform(obj);
    markDirty('物件已调整');
  }

  // ---- Save ----
  topbar.querySelector('[data-save]')!.addEventListener('click', async () => {
    scene.name = (topbar.querySelector('.name-input') as HTMLInputElement).value || 'Untitled Scene';
    scene.thumbnail = viewport.captureThumbnail();
    const input = {
      name: scene.name,
      size: scene.size,
      waterLevel: scene.waterLevel,
      terrain: scene.terrain,
      objects: scene.objects,
      thumbnail: scene.thumbnail,
    };
    try {
      if (savedId) {
        await updateScene(savedId, input);
      } else {
        const created = await createScene(input);
        savedId = created.id;
      }
      dirty = false;
      setSaveState('已保存 ✓');
      await renderSceneList();
    } catch (err) {
      setSaveState('保存失败：' + (err as Error).message);
    }
  });

  // ---- Init ----
  assets = await listAssets();
  (topbar.querySelector('.name-input') as HTMLInputElement).value = scene.name;
  await renderSceneList();
  await viewport.setScene(scene, assets);
  renderTerrainToolbar();
  renderInspector(null);
}
