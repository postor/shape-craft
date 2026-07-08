import { navBar, categoryOptions } from './_shared.ts';
import { getAsset, createAsset, updateAsset, deleteAsset } from '../lib/api.ts';
import {
  AssetComponent,
  AssetPart,
  AssetCategory,
  createPart,
  createEmptyAsset,
  defaultMaterial,
  vec3,
} from '@shape-craft/schema';
import { PREFAB_TEMPLATES } from '@shape-craft/schema';
import { Viewport } from '../lib/three-view.ts';
import { runAgent } from '../lib/agent.ts';

export async function renderEditor(root: HTMLElement, id?: string) {
  const wrap = document.createElement('div');
  wrap.className = 'page editor-page';
  wrap.appendChild(navBar('library'));
  root.appendChild(wrap);

  let asset: AssetComponent;
  let savedId: string | undefined = id;

  if (id) {
    const existing = await getAsset(id);
    if (!existing) {
      wrap.innerHTML += '<p class="empty">未找到该元件。</p>';
      return;
    }
    asset = existing;
  } else {
    asset = createEmptyAsset('Untitled', 'other');
  }

  // ---- Layout ----
  const layout = document.createElement('div');
  layout.className = 'editor-layout';

  const left = document.createElement('div');
  left.className = 'panel hierarchy';
  const center = document.createElement('div');
  center.className = 'panel viewport-panel';
  const right = document.createElement('div');
  right.className = 'panel inspector';

  layout.append(left, center, right);
  wrap.appendChild(layout);

  // ---- Center: toolbar + viewport ----
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  toolbar.innerHTML = `
    <span class="muted">添加基础形状：</span>
    <button class="btn small" data-add="box">Box</button>
    <button class="btn small" data-add="sphere">Sphere</button>
    <button class="btn small" data-add="cylinder">Cylinder</button>
    <button class="btn small" data-add="cone">Cone</button>
    <button class="btn small" data-add="plane">Plane</button>
    <span class="sep"></span>
    <span class="muted">预设：</span>
    ${PREFAB_TEMPLATES.map((t) => `<button class="chip" data-preset="${t.key}">${t.label}</button>`).join('')}
    <span class="sep"></span>
    <button class="btn small" data-shot>📷 截图</button>
  `;
  center.appendChild(toolbar);

  const viewportHost = document.createElement('div');
  viewportHost.className = 'viewport-host';
  center.appendChild(viewportHost);

  const viewport = new Viewport(viewportHost, (pid) => selectPart(pid));

  // ---- Top bar (name/category/save) ----
  const topbar = document.createElement('div');
  topbar.className = 'editor-topbar';
  topbar.innerHTML = `
    <a class="btn small" href="#/library">← 返回</a>
    <input class="name-input" type="text" value="${asset.name}" />
    <select class="cat-input">${categoryOptions(asset.category)}</select>
    <button class="btn primary" data-save>保存</button>
    ${savedId ? '<button class="btn danger" data-del>删除</button>' : ''}
    <span class="save-state"></span>
  `;
  wrap.insertBefore(topbar, layout);

  // ---- Left: hierarchy ----
  left.addEventListener('click', (e) => {
    const del = (e.target as HTMLElement).closest('.row-del') as HTMLElement | null;
    if (!del) return;
    const pid = del.getAttribute('data-del-id');
    if (!pid) return;
    removePart(asset.root, pid);
    if (selectedId === pid) selectedId = null;
    refreshAll();
  });

  function renderHierarchy() {
    left.innerHTML = '<h4>层级结构</h4><div class="tree"></div>';
    const tree = left.querySelector('.tree')!;
    tree.appendChild(partNode(asset.root, true));
  }

  function partNode(part: AssetPart, isRoot: boolean): HTMLElement {
    const row = document.createElement('div');
    row.className = 'tree-row' + (viewport.getSelectedId() === part.id ? ' selected' : '');
    row.innerHTML = `<span class="dot ${part.shape}"></span><span class="pname">${part.name}</span><span class="pshape">${part.shape}</span><button class="row-del" title="删除该部件及其子级" data-del-id="${part.id}">×</button>`;
    row.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('row-del')) return;
      selectPart(part.id);
    });

    const container = document.createElement('div');
    container.appendChild(row);
    if (part.children.length) {
      const kids = document.createElement('div');
      kids.className = 'tree-kids';
      for (const c of part.children) kids.appendChild(partNode(c, false));
      container.appendChild(kids);
    }
    if (isRoot) container.classList.add('root-node');
    return container;
  }

  let selectedId: string | null = null;

  function selectPart(pid: string | null) {
    selectedId = pid;
    viewport.setSelected(pid);
    renderHierarchy();
    renderInspectorBody();
  }

  // ---- Right: inspector + chat ----
  // Build the panel once; the chat log must persist across refreshes (a full
  // re-render would erase conversation history).
  function buildRightPanel() {
    right.innerHTML = '<h4>属性</h4><div class="inspector-body"></div><h4 class="chat-title">聊天建造</h4><div class="chat"></div>';
    renderChat(right.querySelector('.chat') as HTMLElement);
    renderInspectorBody();
  }

  function renderInspectorBody() {
    const body = right.querySelector('.inspector-body') as HTMLElement;
    const part = selectedId ? findPart(asset.root, selectedId) : null;
    body.innerHTML = '';
    if (!part) {
      body.innerHTML = '<p class="muted">在视图或层级中选中一个部件以编辑其变换与材质。</p>';
    } else {
      body.appendChild(inspectorForm(part));
    }
  }

  function numInput(label: string, value: number, on: (v: number) => void): HTMLElement {
    const wrapI = document.createElement('label');
    wrapI.className = 'field';
    wrapI.innerHTML = `<span>${label}</span>`;
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.step = '0.1';
    inp.value = String(value);
    inp.addEventListener('input', () => on(parseFloat(inp.value) || 0));
    wrapI.appendChild(inp);
    return wrapI;
  }

  function vec3Fields(prefix: string, v: { x: number; y: number; z: number }, on: (v: { x: number; y: number; z: number }) => void): HTMLElement {
    const box = document.createElement('div');
    box.className = 'vec3';
    const labels = ['X', 'Y', 'Z'];
    (['x', 'y', 'z'] as const).forEach((axis, i) => {
      box.appendChild(numInput(`${prefix} ${labels[i]}`, v[axis], (val) => on({ ...v, [axis]: val })));
    });
    return box;
  }

  function inspectorForm(part: AssetPart): HTMLElement {
    const form = document.createElement('div');
    form.className = 'inspector-form';

    const nameField = document.createElement('label');
    nameField.className = 'field full';
    nameField.innerHTML = '<span>名称</span>';
    const nameInput = document.createElement('input');
    nameInput.value = part.name;
    nameInput.addEventListener('input', () => {
      part.name = nameInput.value;
      renderHierarchy();
    });
    nameField.appendChild(nameInput);
    form.appendChild(nameField);

    const shapeField = document.createElement('label');
    shapeField.className = 'field full';
    shapeField.innerHTML = '<span>形状</span>';
    const shapeSel = document.createElement('select');
    (['box', 'sphere', 'cylinder', 'cone', 'plane', 'triangle'] as const).forEach((s) => {
      const o = document.createElement('option');
      o.value = s;
      o.textContent = s;
      if (s === part.shape) o.selected = true;
      shapeSel.appendChild(o);
    });
    shapeSel.addEventListener('change', () => {
      part.shape = shapeSel.value as AssetPart['shape'];
      refresh();
    });
    shapeField.appendChild(shapeSel);
    form.appendChild(shapeField);

    const mk = (title: string, v: { x: number; y: number; z: number }, set: (v: { x: number; y: number; z: number }) => void) => {
      const g = document.createElement('div');
      g.className = 'group';
      g.innerHTML = `<div class="group-title">${title}</div>`;
      g.appendChild(vec3Fields(title, v, set));
      return g;
    };

    form.appendChild(mk('尺寸 Size', part.size, (v) => { part.size = v; refresh(); }));
    form.appendChild(mk('位置 Position', part.position, (v) => { part.position = v; refresh(); }));
    form.appendChild(mk('旋转 Rotation (rad)', part.rotation, (v) => { part.rotation = v; refresh(); }));
    form.appendChild(mk('缩放 Scale', part.scale, (v) => { part.scale = v; refresh(); }));

    // Material
    const matGroup = document.createElement('div');
    matGroup.className = 'group';
    matGroup.innerHTML = '<div class="group-title">材质 Material</div>';

    const colorField = document.createElement('label');
    colorField.className = 'field';
    colorField.innerHTML = '<span>颜色</span>';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = part.material.color;
    colorInput.addEventListener('input', () => {
      part.material.color = colorInput.value;
      refresh();
    });
    colorField.appendChild(colorInput);
    matGroup.appendChild(colorField);

    matGroup.appendChild(numInput('Roughness', part.material.roughness, (v) => { part.material.roughness = clamp01(v); refresh(); }));
    matGroup.appendChild(numInput('Metalness', part.material.metalness, (v) => { part.material.metalness = clamp01(v); refresh(); }));
    form.appendChild(matGroup);

    const del = document.createElement('button');
    del.className = 'btn small danger full';
    del.textContent = '删除此部件';
    del.addEventListener('click', () => {
      removePart(asset.root, part.id);
      selectedId = null;
      refreshAll();
    });
    form.appendChild(del);

    return form;
  }

  // ---- Chat ----
  function renderChat(host: HTMLElement) {
    host.innerHTML = `
      <div class="chat-log"></div>
      <div class="chat-input">
        <input type="text" placeholder="例如：帮我造一棵树 / 给这棵树添加叶子 / 把屋顶改成红色" />
        <button class="btn small primary">发送</button>
      </div>
    `;
    const log = host.querySelector('.chat-log') as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;
    const send = host.querySelector('button') as HTMLButtonElement;

    const addMsg = (text: string, who: 'user' | 'bot') => {
      const m = document.createElement('div');
      m.className = `chat-msg ${who}`;
      m.textContent = text;
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
      return m;
    };

    const sendMsg = async () => {
      const text = input.value.trim();
      if (!text) return;
      addMsg(text, 'user');
      input.value = '';
      send.disabled = true;

      // Show a "thinking" bubble immediately; streamed text replaces it live.
      const botMsg = addMsg('', 'bot');
      botMsg.classList.add('thinking');
      botMsg.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
      const onProgress = (t: string) => {
        botMsg.classList.remove('thinking');
        botMsg.textContent = t;
        log.scrollTop = log.scrollHeight;
      };

      const result = await runAgent(text, { asset, selectedId, isNew: !savedId }, onProgress);
      send.disabled = false;
      botMsg.classList.remove('thinking');
      // Ensure the final, authoritative message is shown (covers non-streamed paths).
      if (!botMsg.textContent?.trim() || result.message) botMsg.textContent = result.message;
      log.scrollTop = log.scrollHeight;

      if (result.raw) {
        const det = document.createElement('details');
        det.className = 'chat-raw';
        const summary = document.createElement('summary');
        summary.textContent = '查看 AI 原始返回 (toolcall)';
        const pre = document.createElement('pre');
        pre.textContent = result.raw;
        det.append(summary, pre);
        log.appendChild(det);
        log.scrollTop = log.scrollHeight;
      }
      if (result.asset) {
        asset = result.asset;
        (topbar.querySelector('.name-input') as HTMLInputElement).value = asset.name;
        (topbar.querySelector('.cat-input') as HTMLSelectElement).value = asset.category;
        if (selectedId && !findPart(asset.root, selectedId)) selectedId = null;
        const status = await saveCurrent();
        setSaveState(status === 'failed' ? 'AI 结果已载入，但自动保存失败（可手动保存）' : 'AI 已修改并保存 ✓');
        refreshAll();
      }
    };

    send.addEventListener('click', sendMsg);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMsg(); });
    addMsg('你好！我可以生成 树 / 花 / 草 / 房子，也能修改当前元件（如“添加叶子”“把屋顶改成红色”），并自动保存。', 'bot');
  }

  // ---- Mutations ----
  function refresh() {
    viewport.setRoot(asset.root);
    if (selectedId) viewport.setSelected(selectedId);
  }
  function refreshAll() {
    refresh();
    renderHierarchy();
    renderInspectorBody();
  }

  function addPrimitive(shape: AssetPart['shape']) {
    const parent = (selectedId && findPart(asset.root, selectedId)) || asset.root;
    const part = createPart({
      shape,
      name: `${shape[0].toUpperCase()}${shape.slice(1)} ${parent.children.length + 1}`,
      material: defaultMaterial(shape === 'sphere' || shape === 'cone' ? '#4caf50' : '#cccccc'),
      size: shape === 'box' ? vec3(0.6, 0.6, 0.6) : shape === 'sphere' ? vec3(0.4, 0.4, 0.4) : shape === 'plane' ? vec3(1, 1, 1) : vec3(0.3, 0.8, 0.3),
      position: vec3(0, shape === 'cylinder' || shape === 'cone' ? 0.4 : 0.3, 0),
    });
    parent.children.push(part);
    selectPart(part.id);
    refresh();
  }

  toolbar.addEventListener('click', (e) => {
    const btn = e.target as HTMLElement;
    const add = btn.getAttribute?.('data-add');
    const preset = btn.getAttribute?.('data-preset');
    const shot = btn.getAttribute?.('data-shot');
    if (add) addPrimitive(add as AssetPart['shape']);
    if (preset) {
      const tpl = PREFAB_TEMPLATES.find((t) => t.key === preset)!;
      asset.root = tpl.build();
      asset.name = tpl.defaultName;
      asset.category = tpl.key as AssetCategory;
      savedId = undefined;
      (topbar.querySelector('.name-input') as HTMLInputElement).value = asset.name;
      (topbar.querySelector('.cat-input') as HTMLSelectElement).value = asset.category;
      selectPart(null);
      refreshAll();
    }
    if (shot) {
      asset.thumbnail = viewport.captureThumbnail();
      setSaveState('已截图，保存后生效');
    }
  });

  // ---- Save / delete ----
  function setSaveState(text: string) {
    const s = topbar.querySelector('.save-state') as HTMLElement;
    s.textContent = text;
  }

  function ensureDelButton() {
    const delBtn = topbar.querySelector('[data-del]');
    if (!delBtn) {
      const b = document.createElement('button');
      b.className = 'btn danger';
      b.setAttribute('data-del', '');
      b.textContent = '删除';
      topbar.insertBefore(b, topbar.querySelector('.save-state'));
    }
  }

  async function saveCurrent(): Promise<'created' | 'updated' | 'failed'> {
    const name = (topbar.querySelector('.name-input') as HTMLInputElement).value || 'Untitled';
    const category = (topbar.querySelector('.cat-input') as HTMLSelectElement).value as AssetCategory;
    asset.name = name;
    asset.category = category;
    if (!asset.thumbnail) asset.thumbnail = viewport.captureThumbnail();
    const input = {
      name: asset.name,
      category: asset.category,
      description: asset.description,
      root: asset.root,
      thumbnail: asset.thumbnail,
    };
    try {
      if (savedId) {
        await updateAsset(savedId, input);
        return 'updated';
      }
      const created = await createAsset(input);
      savedId = created.id;
      asset.id = created.id;
      asset.createdAt = created.createdAt;
      asset.updatedAt = created.updatedAt;
      ensureDelButton();
      return 'created';
    } catch (err) {
      setSaveState('保存失败：' + (err as Error).message);
      return 'failed';
    }
  }

  topbar.querySelector('[data-save]')!.addEventListener('click', async () => {
    const status = await saveCurrent();
    if (status !== 'failed') setSaveState('已保存 ✓');
  });

  topbar.querySelector('[data-del]')?.addEventListener('click', async () => {
    if (!savedId) return;
    if (confirm('确定删除该元件？')) {
      await deleteAsset(savedId);
      location.hash = '#/library';
    }
  });

  // initial render
  buildRightPanel();
  refreshAll();
}

// ---- tree helpers ----
function findPart(node: AssetPart, id: string): AssetPart | null {
  if (node.id === id) return node;
  for (const c of node.children) {
    const f = findPart(c, id);
    if (f) return f;
  }
  return null;
}

function removePart(node: AssetPart, id: string): boolean {
  const idx = node.children.findIndex((c) => c.id === id);
  if (idx !== -1) {
    node.children.splice(idx, 1);
    return true;
  }
  for (const c of node.children) {
    if (removePart(c, id)) return true;
  }
  return false;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
