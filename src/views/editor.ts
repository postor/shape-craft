import { categoryOptions } from './_shared.ts';
import { getAsset, createAsset, updateAsset, deleteAsset, listAssets } from '../lib/api.ts';
import {
  AssetComponent,
  AssetPart,
  AssetCategory,
  ScriptSlot,
  createPart,
  createEmptyAsset,
  defaultMaterial,
  uid,
  vec3,
} from '../schema';
import { Viewport } from '../lib/three-view.ts';
import { createDimensionOverlay } from '../lib/ruler.ts';
import { resolveRefs, buildInstanceReference, findPart, type RefMap } from '../lib/instance.ts';
import { runAgent, verifyAsset, type AgentResult } from '../lib/agent.ts';
import { loadSettings } from '../lib/settings.ts';
import { createChatHistory } from '../lib/chat-history.ts';

export async function renderEditor(root: HTMLElement, id?: string) {
  const wrap = document.createElement('div');
  wrap.className = 'editor-page';
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
    <div class="toolbar-row">
      <span class="muted">基础形状：</span>
      <button class="btn small" data-add="box">Box</button>
      <button class="btn small" data-add="sphere">Sphere</button>
      <button class="btn small" data-add="cylinder">Cylinder</button>
      <button class="btn small" data-add="cone">Cone</button>
      <button class="btn small" data-add="plane">Plane</button>
      <button class="btn small" data-add="node">Node 节点</button>
    </div>
    <div class="toolbar-row">
      <span class="muted">引用：</span>
      <div class="ref-combo" data-ref-combo>
        <input class="ref-search" data-ref-search placeholder="搜索元件…" autocomplete="off" />
        <div class="ref-list" data-ref-list hidden></div>
      </div>
      <button class="btn small" data-insert-ref>插入引用</button>
    </div>
    <div class="toolbar-row">
      <span class="muted">变换：</span>
      <button class="btn small mode active" data-mode="translate">拖拽</button>
      <button class="btn small mode" data-mode="rotate">旋转</button>
      <button class="btn small mode" data-mode="scale">缩放</button>
      <span class="sep"></span>
      <button class="btn small" data-shot>📷 截图</button>
    </div>
  `;
  center.appendChild(toolbar);

  // ---- Reference combobox (searchable) ----
  let refAssets: AssetComponent[] = [];
  let selectedRefId: string | null = null;
  const refSearch = toolbar.querySelector('[data-ref-search]') as HTMLInputElement;
  const refList = toolbar.querySelector('[data-ref-list]') as HTMLElement;

  function renderRefList(query: string) {
    const q = query.trim().toLowerCase();
    const matches = refAssets.filter(
      (a) => !q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q),
    );
    if (!matches.length) {
      refList.innerHTML = '<div class="ref-empty">无匹配元件</div>';
    } else {
      refList.innerHTML = matches
        .slice(0, 8)
        .map(
          (a) =>
            `<div class="ref-item${a.id === selectedRefId ? ' active' : ''}" data-ref-id="${a.id}">${a.name} · ${a.category}</div>`,
        )
        .join('');
    }
    refList.hidden = false;
  }

  refSearch.addEventListener('focus', async () => {
    if (!refAssets.length) await populateRefs();
    renderRefList(refSearch.value);
  });
  refSearch.addEventListener('input', () => {
    selectedRefId = null;
    renderRefList(refSearch.value);
  });
  refSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = refList.querySelector('.ref-item') as HTMLElement | null;
      if (first) first.click();
    } else if (e.key === 'Escape') {
      refList.hidden = true;
    }
  });
  wrap.addEventListener('click', (e) => {
    if (!toolbar.querySelector('[data-ref-combo]')!.contains(e.target as Node)) {
      refList.hidden = true;
    }
  });

  const viewportHost = document.createElement('div');
  viewportHost.className = 'viewport-host';
  center.appendChild(viewportHost);

  const viewport = new Viewport(
    viewportHost,
    (pid) => selectPart(pid),
    (id, t) => applyTransform(id, t),
  );
  (root as HTMLElement & { __dispose?: () => void }).__dispose = () => {
    try {
      viewport.dispose();
    } catch {
      /* already torn down */
    }
  };

  const updateDimensions = createDimensionOverlay(viewportHost);

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
    const lock = part.shape === 'instance' ? '<span class="lock" title="实例引用（整体锁定）">🔒</span>' : '';
    row.innerHTML = `<span class="dot ${part.shape}"></span><span class="pname">${part.name}</span><span class="pshape">${part.shape}</span>${lock}<button class="row-del" title="删除该部件及其子级" data-del-id="${part.id}">×</button>`;
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

  // Apply a gizmo-driven transform back onto the asset model and keep the
  // inspector in sync. We only mutate the part data (not the 3D scene) here so
  // the in-flight drag is not interrupted by a scene rebuild.
  function applyTransform(id: string, t: { position: any; rotation: any; scale: any }) {
    const part = findPart(asset.root, id);
    if (!part) return;
    part.position = t.position;
    part.rotation = t.rotation;
    part.scale = t.scale;
    renderInspectorBody();
  }

  // ---- Right: inspector + chat ----
  // Build the panel once; the chat log must persist across refreshes (a full
  // re-render would erase conversation history).
  function buildRightPanel() {
    right.innerHTML = '<h4>属性</h4><div class="inspector-body"></div><h4 class="chat-title">聊天建造</h4><div class="chat"></div>';
    renderChat(right.querySelector('.chat') as HTMLElement, `asset:${savedId ?? 'new'}`);
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
    if (part.shape === 'instance') return instanceForm(part);
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
    (['box', 'sphere', 'cylinder', 'cone', 'plane', 'triangle', 'node'] as const).forEach((s) => {
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

    // Custom script slots bound to this part (Unity-style update(t, dt)).
    form.appendChild(scriptPanel(part));

    return form;
  }

  /**
   * Editor panel for a part's custom scripts. Lists every script slot bound to
   * `part`, lets the user edit its source, apply (recompile + run), or delete
   * it. "Add script" creates a new slot with a spinning-cube starter.
   */
  function scriptPanel(part: AssetPart): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'group script-group';
    wrap.innerHTML = '<div class="group-title">脚本 Scripts（Unity 式 update）</div>';

    const list = document.createElement('div');
    list.className = 'script-list';
    const slots = (asset.scripts ?? []).filter((s) => s.partId === part.id);
    for (const slot of slots) list.appendChild(scriptRow(slot));
    wrap.appendChild(list);

    const add = document.createElement('button');
    add.className = 'btn small full';
    add.textContent = '+ 添加脚本';
    add.addEventListener('click', () => {
      asset.scripts = asset.scripts ?? [];
      const slot: ScriptSlot = {
        id: uid(),
        partId: part.id,
        name: 'Script',
        code: '// Unity-style: called every frame.\n// t = total seconds, dt = frame delta.\n// self = this part, scene = asset root, THREE = three.js\nfunction update(t, dt) {\n  self.rotation.y += dt;\n}\n',
      };
      asset.scripts.push(slot);
      viewport.setScripts(asset.scripts);
      renderInspectorBody();
    });
    wrap.appendChild(add);
    return wrap;
  }

  function scriptRow(slot: ScriptSlot): HTMLElement {
    const row = document.createElement('div');
    row.className = 'script-row';

    const name = document.createElement('input');
    name.className = 'script-name';
    name.value = slot.name;
    name.addEventListener('input', () => { slot.name = name.value; });

    const ta = document.createElement('textarea');
    ta.className = 'script-code';
    ta.spellcheck = false;
    ta.value = slot.code;
    ta.addEventListener('input', () => { slot.code = ta.value; });

    const apply = document.createElement('button');
    apply.className = 'btn tiny primary';
    apply.textContent = '应用';
    apply.addEventListener('click', () => {
      slot.code = ta.value;
      slot.name = name.value;
      viewport.setScripts(asset.scripts);
    });

    const del = document.createElement('button');
    del.className = 'btn tiny danger';
    del.textContent = '删除';
    del.addEventListener('click', () => {
      asset.scripts = (asset.scripts ?? []).filter((s) => s.id !== slot.id);
      viewport.setScripts(asset.scripts);
      renderInspectorBody();
    });

    const head = document.createElement('div');
    head.className = 'script-head';
    head.append(name, apply, del);

    row.append(head, ta);
    return row;
  }

  /** Read-only inspector for a locked instance reference. */
  function instanceForm(part: AssetPart): HTMLElement {
    const form = document.createElement('div');
    form.className = 'inspector-form';
    form.innerHTML = `
      <div class="group">
        <div class="group-title">实例引用 Instance</div>
        <p class="muted">该部件整体引用了另一个元件，内部细节不可在此编辑。</p>
        <label class="field full"><span>名称</span></label>
        <input class="inst-name" type="text" value="${part.name}" />
        <label class="field full"><span>引用 ID</span></label>
        <input class="inst-ref" type="text" value="${part.refId ?? ''}" readonly />
      </div>
    `;
    const nameInput = form.querySelector('.inst-name') as HTMLInputElement;
    nameInput.addEventListener('input', () => {
      part.name = nameInput.value;
      renderHierarchy();
    });
    const open = document.createElement('a');
    open.className = 'btn small full';
    open.textContent = '打开原件编辑器 →';
    open.href = `#/editor/${part.refId}`;
    form.appendChild(open);

    const del = document.createElement('button');
    del.className = 'btn small danger full';
    del.textContent = '删除此引用';
    del.addEventListener('click', () => {
      removePart(asset.root, part.id);
      selectedId = null;
      refreshAll();
    });
    form.appendChild(del);
    return form;
  }

  // ---- Chat ----
  function renderChat(host: HTMLElement, scope: string) {
    host.innerHTML = `
      <div class="chat-log"></div>
      <div class="chat-input">
        <input type="text" placeholder="例如：帮我造一棵树 / 给这棵树添加叶子 / 把屋顶改成红色" />
        <button class="btn small primary">发送</button>
      </div>
      <div class="chat-status">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span class="chat-status-text"></span>
      </div>
    `;
    const log = host.querySelector('.chat-log') as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;
    const send = host.querySelector('button') as HTMLButtonElement;
    const statusEl = host.querySelector('.chat-status') as HTMLElement;
    const statusText = host.querySelector('.chat-status-text') as HTMLElement;
    // Persistent "AI is working" indicator: stays visible for the whole
    // conversation turn (including tool-call waits and the verify loop) so the
    // user never mistakes an in-flight request for a completed reply.
    let busyCount = 0;
    const setBusy = (active: boolean, label = 'AI 正在思考…') => {
      busyCount = Math.max(0, busyCount + (active ? 1 : -1));
      if (busyCount > 0) {
        statusText.textContent = label;
        statusEl.classList.add('active');
      } else {
        statusEl.classList.remove('active');
        statusText.textContent = '';
      }
    };
    const history = createChatHistory(scope);

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
      history.push(text);
      addMsg(text, 'user');
      input.value = '';
      send.disabled = true;
      setBusy(true, 'AI 正在思考…');

      // Show a "thinking" bubble immediately; streamed text replaces it live.
      const botMsg = addMsg('', 'bot');
      botMsg.classList.add('thinking');
      botMsg.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
      const onProgress = (t: string) => {
        botMsg.classList.remove('thinking');
        // Keep an "editing" cursor so the user knows the reply is still in flight
        // (e.g. while the model is streaming a tool call's arguments).
        botMsg.classList.add('editing');
        botMsg.textContent = t;
        log.scrollTop = log.scrollHeight;
      };

      // Render the current preview and ask the model whether further changes are
      // needed. Streams its reply into a fresh bubble; returns the result so the
      // caller can decide whether to apply another round.
      const verifyOnce = async (a: AssetComponent, img: string): Promise<AgentResult> => {
        const vb = addMsg('', 'bot');
        vb.classList.add('thinking');
        vb.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        const onV = (t: string) => {
          vb.classList.remove('thinking');
          vb.classList.add('editing');
          vb.textContent = t;
          log.scrollTop = log.scrollHeight;
        };
        const v = await verifyAsset(a, img, onV);
        vb.classList.remove('thinking', 'editing');
        if (!vb.textContent?.trim() || v.message) vb.textContent = v.message;
        log.scrollTop = log.scrollHeight;
        if (v.raw) {
          const det = document.createElement('details');
          det.className = 'chat-raw';
          const summary = document.createElement('summary');
          summary.textContent = '查看 AI 完整返回';
          const pre = document.createElement('pre');
          pre.textContent = v.raw;
          det.append(summary, pre);
          log.appendChild(det);
          log.scrollTop = log.scrollHeight;
        }
        return v;
      };

      const result = await runAgent(text, { asset, selectedId, isNew: !savedId }, onProgress);
      send.disabled = false;
      botMsg.classList.remove('thinking', 'editing');
      // Ensure the final, authoritative message is shown (covers non-streamed paths).
      if (!botMsg.textContent?.trim() || result.message) botMsg.textContent = result.message;
      log.scrollTop = log.scrollHeight;

      if (result.raw) {
        const det = document.createElement('details');
        det.className = 'chat-raw';
        const summary = document.createElement('summary');
        summary.textContent = '查看 AI 完整返回';
        const pre = document.createElement('pre');
        pre.textContent = result.raw;
        det.append(summary, pre);
        log.appendChild(det);
        log.scrollTop = log.scrollHeight;
      }
      if (result.asset) {
        // Apply the model's edit, then loop: render a preview image, send it
        // back to the model for visual verification, and keep applying fixes
        // until the model says "完成" (or we hit the round cap, or vision is off).
        const MAX_VERIFY_ROUNDS = 3;
        let round = 0;
        let next: AssetComponent | undefined = result.asset;
        while (next) {
          asset = next;
          (topbar.querySelector('.name-input') as HTMLInputElement).value = asset.name;
          (topbar.querySelector('.cat-input') as HTMLSelectElement).value = asset.category;
          if (selectedId && !findPart(asset.root, selectedId)) selectedId = null;
          const status = await saveCurrent();
          setSaveState(status === 'failed' ? 'AI 结果已载入，但自动保存失败（可手动保存）' : 'AI 已修改并保存 ✓');
          refreshAll();

          if (round >= MAX_VERIFY_ROUNDS) break;
          round++;
          const cfg = loadSettings();
          if (!cfg.enabled || !cfg.apiKey) break;
          if (!cfg.supportsVision) {
            addMsg('（当前接口未启用图片验证，跳过自动校验）', 'bot');
            break;
          }
          const img = viewport.captureThumbnail();
          addMsg('（已渲染预览，发送给模型校验是否仍需修改…）', 'bot');
          setBusy(true, 'AI 正在编辑…');
          const v = await verifyOnce(asset, img);
          setBusy(false);
          next = v.asset;
          if (!next) break;
        }
      }
      setBusy(false);
    };

    send.addEventListener('click', sendMsg);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendMsg();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = history.prev();
        if (prev !== null) {
          input.value = prev;
          input.setSelectionRange(input.value.length, input.value.length);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        input.value = history.next();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
    addMsg('你好！我可以修改当前元件（如“把屋顶改成红色”“加一扇门”），也能插入引用其它元件，并自动保存。', 'bot');
  }

  // ---- Mutations ----
  async function refresh() {
    const refs: RefMap = await resolveRefs(asset.root);
    const instCount = (function count(n: AssetPart): number {
      let c = n.shape === 'instance' ? 1 : 0;
      for (const ch of n.children) c += count(ch);
      return c;
    })(asset.root);
    console.log('[editor] refresh: instances in asset.root=', instCount, 'refs.size=', refs.size);
    viewport.setRoot(asset.root, (id) => refs.get(id) ?? null);
    if (selectedId) viewport.setSelected(selectedId);
    viewport.setScripts(asset.scripts);
  }
  function refreshAll() {
    void refresh();
    updateDimensions(viewport.getDimensions());
    renderHierarchy();
    renderInspectorBody();
  }

  /** Fill the "insert reference" dropdown with every saved asset. */
  async function populateRefs() {
    refAssets = (await listAssets()).filter((a) => a.id !== savedId);
    if (selectedRefId && !refAssets.some((a) => a.id === selectedRefId)) {
      selectedRefId = null;
      refSearch.value = '';
    }
  }

  function addPrimitive(shape: AssetPart['shape']) {
    let parent = (selectedId && findPart(asset.root, selectedId)) || asset.root;
    // Never nest edits inside a locked instance — its internal tree is owned by
    // the referenced asset. Fall back to the root in that case.
    if (parent.shape === 'instance') parent = asset.root;
    const isNode = shape === 'node';
    const part = createPart({
      shape,
      name: isNode ? `Node ${parent.children.length + 1}` : `${shape[0].toUpperCase()}${shape.slice(1)} ${parent.children.length + 1}`,
      // A node has no visible content, so its size/material/offset are inert;
      // keep them at neutral defaults consistent with other shapes.
      material: defaultMaterial(shape === 'sphere' || shape === 'cone' ? '#4caf50' : '#cccccc'),
      size: shape === 'box' ? vec3(0.6, 0.6, 0.6) : shape === 'sphere' ? vec3(0.4, 0.4, 0.4) : shape === 'plane' ? vec3(1, 1, 1) : vec3(0.3, 0.8, 0.3),
      position: vec3(0, isNode ? 0 : shape === 'cylinder' || shape === 'cone' ? 0.4 : 0.3, 0),
    });
    parent.children.push(part);
    selectPart(part.id);
    refresh();
  }

  toolbar.addEventListener('click', async (e) => {
    const btn = e.target as HTMLElement;
    const add = btn.getAttribute?.('data-add');
    const shot = btn.hasAttribute?.('data-shot');
    const mode = btn.getAttribute?.('data-mode');
    if (add) addPrimitive(add as AssetPart['shape']);
    const refItem = btn.getAttribute?.('data-ref-id');
    if (refItem) {
      selectedRefId = refItem;
      const a = refAssets.find((x) => x.id === refItem);
      refSearch.value = a?.name ?? '';
      refList.hidden = true;
      renderRefList(refSearch.value);
    }
    if (mode) {
      viewport.setTransformMode(mode as 'translate' | 'rotate' | 'scale');
      toolbar.querySelectorAll('.mode').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    }
    const insertRef = btn.hasAttribute?.('data-insert-ref');
    if (insertRef) {
      const refId = selectedRefId;
      if (!refId) return;
      const refAsset = refAssets.find((a) => a.id === refId);
      const inst = buildInstanceReference({
        root: asset.root,
        selectedId,
        refId,
        refName: refAsset?.name ?? 'Instance',
      });
      selectPart(inst.id);
      refreshAll();
    }
    if (shot) {
      // Capture the current viewport and persist it as the thumbnail right away.
      // For an unsaved asset this just previews; the next Save recaptures the live view.
      asset.thumbnail = viewport.captureThumbnail();
      if (savedId) {
        await updateAsset(savedId, buildInput());
        setSaveState('已截图并保存 ✓');
      } else {
        setSaveState('已截图（保存后将按当前视图刷新）');
      }
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

  function buildInput() {
    return {
      name: asset.name,
      category: asset.category,
      description: asset.description,
      root: asset.root,
      thumbnail: asset.thumbnail,
      scripts: asset.scripts,
    };
  }

  async function saveCurrent(): Promise<'created' | 'updated' | 'failed'> {
    const name = (topbar.querySelector('.name-input') as HTMLInputElement).value || 'Untitled';
    const category = (topbar.querySelector('.cat-input') as HTMLSelectElement).value as AssetCategory;
    asset.name = name;
    asset.category = category;
    // Always refresh the snapshot from the current 3D viewport on save, so the library
    // thumbnail never goes stale after geometry/camera changes.
    asset.thumbnail = viewport.captureThumbnail();
    try {
      if (savedId) {
        await updateAsset(savedId, buildInput());
        return 'updated';
      }
      const created = await createAsset(buildInput());
      savedId = created.id;
      asset.id = created.id;
      asset.createdAt = created.updatedAt;
      ensureDelButton();
      void populateRefs();
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
  void populateRefs();
  refreshAll();

  // ---- test hook: `?ref` auto-fetches the list and inserts the first reference ----
  // (hash routing, so the param lives after `#/editor?ref=1`)
  if (new URLSearchParams(location.hash.split('?')[1] || '').has('ref')) {
    (async () => {
      await populateRefs();
      if (refAssets.length) {
        const first = refAssets[0];
        const inst = buildInstanceReference({ root: asset.root, selectedId, refId: first.id, refName: first.name });
        selectPart(inst.id);
        refreshAll();
      }
    })();
  }
}

// ---- tree helpers ----
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
