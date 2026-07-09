import { getMap, createMap, updateMap, deleteMap } from '../lib/map-api.ts';
import { listAssets } from '../lib/api.ts';
import {
  MapComponent,
  MapInput,
  MapInstance,
  createMapInstance,
  createEmptyMap,
  type AssetComponent,
  type Vec3,
} from '../schema';
import { MapViewport, type MapEditMode } from '../lib/map-view.ts';
import { runMapAgent } from '../lib/map-agent.ts';

export async function renderMapEditor(root: HTMLElement, id?: string) {
  const wrap = document.createElement('div');
  wrap.className = 'editor-page';
  root.appendChild(wrap);

  let map: MapComponent;
  let savedId: string | undefined = id;
  const assets = new Map<string, AssetComponent>();
  let assetsList: AssetComponent[] = [];

  if (id) {
    const existing = await getMap(id);
    if (!existing) {
      wrap.innerHTML += '<p class="empty">未找到该地图。</p>';
      return;
    }
    map = existing;
  } else {
    map = createEmptyMap('Untitled Map');
  }

  const loaded = await listAssets();
  for (const a of loaded) assets.set(a.id, a);
  assetsList = loaded;

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

  // ---- Top bar ----
  const topbar = document.createElement('div');
  topbar.className = 'editor-topbar';
  topbar.innerHTML = `
    <a class="btn small" href="#/maps">← 返回</a>
    <input class="name-input" type="text" value="${map.name}" />
    <button class="btn primary" data-save>保存</button>
    ${savedId ? '<button class="btn danger" data-del>删除</button>' : ''}
    <span class="save-state"></span>
  `;
  wrap.insertBefore(topbar, layout);

  // ---- Center: viewport ----
  const viewportHost = document.createElement('div');
  viewportHost.className = 'viewport-host';
  center.appendChild(viewportHost);

  const viewport = new MapViewport(viewportHost, map, {
    onSelectInstance: (iid) => selectInstance(iid),
    onPlace: (point) => placeInstance(point),
    onChange: () => scheduleSave(),
  });
  (root as HTMLElement & { __dispose?: () => void }).__dispose = () => {
    try {
      viewport.dispose();
    } catch {
      /* already torn down */
    }
  };

  // ---- Left: tools + placed instances ----
  left.innerHTML = `
    <h4>编辑模式</h4>
    <div class="toolbar map-modes">
      <button class="btn small" data-mode="roam">漫游</button>
      <button class="btn small" data-mode="raise">抬升</button>
      <button class="btn small" data-mode="lower">降低</button>
      <button class="btn small" data-mode="flatten">平整</button>
    </div>
    <h4>水域 Water</h4>
    <label class="field full"><span>显示水域</span><input type="checkbox" class="water-enabled" ${map.water.enabled ? 'checked' : ''}/></label>
    <label class="field full"><span>水位 Level</span><input type="range" class="water-level" min="-3" max="6" step="0.1" value="${map.water.level}"/></label>
    <label class="field full"><span>颜色</span><input type="color" class="water-color" value="${map.water.color}"/></label>
    <h4>放置元件</h4>
    <div class="field full">
      <select class="asset-select"><option value="">选择元件…</option>${assetsList
        .map((a) => `<option value="${a.id}">${a.name}</option>`)
        .join('')}</select>
      <button class="btn small" data-place>放置模式</button>
    </div>
    <h4>已放置元件</h4>
    <div class="instance-list"></div>
  `;

  // ---- Right: inspector + chat ----
  right.innerHTML = '<h4>属性</h4><div class="inspector-body"></div><h4 class="chat-title">聊天建造</h4><div class="chat"></div>';
  renderChat(right.querySelector('.chat') as HTMLElement);
  renderInspector();
  renderInstanceList();
  setActiveMode('roam');

  // ---- Mode handling ----
  function setActiveMode(mode: MapEditMode) {
    viewport.setMode(mode);
    left.querySelectorAll('.map-modes button').forEach((b) => {
      b.classList.toggle('active', (b as HTMLElement).getAttribute('data-mode') === mode);
    });
  }

  left.querySelectorAll('.map-modes button').forEach((b) => {
    b.addEventListener('click', () => {
      const mode = (b as HTMLElement).getAttribute('data-mode') as MapEditMode;
      setActiveMode(mode);
    });
  });

  left.querySelector('.water-enabled')!.addEventListener('change', (e) => {
    const enabled = (e.target as HTMLInputElement).checked;
    map.water.enabled = enabled;
    viewport.setWater(map.water.level, enabled);
    scheduleSave();
  });
  left.querySelector('.water-level')!.addEventListener('input', (e) => {
    const level = parseFloat((e.target as HTMLInputElement).value);
    map.water.level = level;
    viewport.setWater(level, map.water.enabled);
    scheduleSave();
  });
  left.querySelector('.water-color')!.addEventListener('input', (e) => {
    map.water.color = (e.target as HTMLInputElement).value;
    viewport.setWater(map.water.level, map.water.enabled);
    scheduleSave();
  });
  left.querySelector('[data-place]')!.addEventListener('click', () => {
    const sel = left.querySelector('.asset-select') as HTMLSelectElement;
    const assetId = sel.value;
    if (!assetId) {
      alert('请先在上方选择一个元件。');
      return;
    }
    viewport.setPlaceAsset(assetId);
    setActiveMode('place');
  });

  // ---- Instance list ----
  function renderInstanceList() {
    const list = left.querySelector('.instance-list') as HTMLElement;
    list.innerHTML = '';
    if (map.instances.length === 0) {
      list.innerHTML = '<p class="muted">暂无元件。选择元件后进入「放置模式」点击地形添加。</p>';
      return;
    }
    map.instances.forEach((inst) => {
      const asset = assets.get(inst.assetId);
      const row = document.createElement('div');
      row.className = 'tree-row' + (selectedInstanceId === inst.id ? ' selected' : '');
      row.innerHTML = `<span class="dot node"></span><span class="pname">${inst.name ?? asset?.name ?? inst.assetId}</span><button class="row-del" title="删除该元件" data-del-id="${inst.id}">×</button>`;
      row.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('row-del')) return;
        setActiveMode('select');
        selectInstance(inst.id);
      });
      list.appendChild(row);
    });
  }

  left.querySelector('.instance-list')!.addEventListener('click', (e) => {
    const del = (e.target as HTMLElement).closest('.row-del') as HTMLElement | null;
    if (!del) return;
    const pid = del.getAttribute('data-del-id');
    if (!pid) return;
    removeInstance(pid);
  });

  let selectedInstanceId: string | null = null;

  function selectInstance(iid: string | null) {
    selectedInstanceId = iid;
    viewport.setSelectedInstance(iid);
    renderInspector();
    renderInstanceList();
  }

  function findInstance(iid: string): MapInstance | null {
    return map.instances.find((i) => i.id === iid) ?? null;
  }

  function placeInstance(point: { x: number; y: number; z: number }) {
    const assetId = (left.querySelector('.asset-select') as HTMLSelectElement).value;
    if (!assetId) return;
    const asset = assets.get(assetId);
    const inst = createMapInstance(assetId, { x: point.x, y: point.y, z: point.z }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, asset?.name);
    map.instances.push(inst);
    viewport.refreshInstances();
    selectInstance(inst.id);
    scheduleSave();
  }

  function removeInstance(iid: string) {
    const idx = map.instances.findIndex((i) => i.id === iid);
    if (idx === -1) return;
    map.instances.splice(idx, 1);
    if (selectedInstanceId === iid) selectedInstanceId = null;
    viewport.refreshInstances();
    selectInstance(null);
    scheduleSave();
  }

  // ---- Inspector ----
  function renderInspector() {
    const body = right.querySelector('.inspector-body') as HTMLElement;
    const inst = selectedInstanceId ? findInstance(selectedInstanceId) : null;
    body.innerHTML = '';
    if (!inst) {
      body.innerHTML = `<p class="muted">在视图或列表中选择一个已放置元件以编辑其变换。</p>
        <div class="group"><div class="group-title">地图信息</div>
        <div class="muted">名称：${map.name}</div>
        <div class="muted">尺寸：${map.size} × ${map.size}</div>
        <div class="muted">地形网格：${map.terrain.segments + 1} × ${map.terrain.segments + 1}</div>
        <div class="muted">水域：${map.water.enabled ? '开启 (level ' + map.water.level + ')' : '关闭'}</div>
        <div class="muted">元件数：${map.instances.length}</div></div>`;
      body.appendChild(
        numInput('地图边长 Size', map.size, (v) => {
          map.size = v;
          viewport.setSize(v);
          scheduleSave();
          renderInspector();
        }),
      );
      return;
    }
    body.appendChild(instanceForm(inst));
  }

  function numInput(label: string, value: number, on: (v: number) => void): HTMLElement {
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

  function vec3Fields(prefix: string, v: Vec3, on: (v: Vec3) => void): HTMLElement {
    const box = document.createElement('div');
    box.className = 'vec3';
    const labels = ['X', 'Y', 'Z'];
    (['x', 'y', 'z'] as const).forEach((axis, i) => {
      box.appendChild(numInput(`${prefix} ${labels[i]}`, v[axis], (val) => on({ ...v, [axis]: val })));
    });
    return box;
  }

  function instanceForm(inst: MapInstance): HTMLElement {
    const form = document.createElement('div');
    form.className = 'inspector-form';
    form.innerHTML = `<div class="muted">${assets.get(inst.assetId)?.name ?? inst.assetId}</div>`;
    const mk = (title: string, v: Vec3, set: (v: Vec3) => void) => {
      const g = document.createElement('div');
      g.className = 'group';
      g.innerHTML = `<div class="group-title">${title}</div>`;
      g.appendChild(vec3Fields(title, v, set));
      return g;
    };
    form.appendChild(mk('位置 Position', inst.position, (v) => { inst.position = v; viewport.refreshInstances(); scheduleSave(); }));
    form.appendChild(mk('旋转 Rotation (rad)', inst.rotation, (v) => { inst.rotation = v; viewport.refreshInstances(); scheduleSave(); }));
    form.appendChild(mk('缩放 Scale', inst.scale, (v) => { inst.scale = v; viewport.refreshInstances(); scheduleSave(); }));

    const del = document.createElement('button');
    del.className = 'btn small danger full';
    del.textContent = '删除此元件';
    del.addEventListener('click', () => removeInstance(inst.id));
    form.appendChild(del);
    return form;
  }

  // ---- Chat ----
  function renderChat(host: HTMLElement) {
    host.innerHTML = `
      <div class="chat-log"></div>
      <div class="chat-input">
        <input type="text" placeholder="例如：放一棵树 / 整体抬升地形 / 开启水域 / 提升水位" />
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

      const botMsg = addMsg('', 'bot');
      botMsg.classList.add('thinking');
      botMsg.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
      const onProgress = (t: string) => {
        botMsg.classList.remove('thinking');
        botMsg.textContent = t;
        log.scrollTop = log.scrollHeight;
      };

      const result = await runMapAgent(text, { map, assets: assetsList, selectedInstanceId, isNew: !savedId }, onProgress);
      send.disabled = false;
      botMsg.classList.remove('thinking');
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

      if (result.map) {
        applyMapUpdate(result.map);
        viewport.setData(map, assets);
        // keep selection valid; rebuild lists
        if (selectedInstanceId && !findInstance(selectedInstanceId)) selectedInstanceId = null;
        viewport.setSelectedInstance(selectedInstanceId);
        renderInspector();
        renderInstanceList();
        const status = await saveCurrent();
        setSaveState(status === 'failed' ? 'AI 结果已载入，但自动保存失败（可手动保存）' : 'AI 已修改并保存 ✓');
      }
    };

    send.addEventListener('click', sendMsg);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMsg();
    });
    addMsg('你好！我可以放置 树 / 花 / 草 / 房子，也能调整地形与水域（如“整体抬升地形”“开启水域”“提升水位”），并自动保存。', 'bot');
  }

  // ---- Map update apply ----
  function applyMapUpdate(next: MapComponent) {
    map.name = next.name;
    map.description = next.description;
    map.size = next.size;
    map.terrain = next.terrain;
    map.water = next.water;
    map.instances = next.instances;
    map.thumbnail = next.thumbnail;
    (topbar.querySelector('.name-input') as HTMLInputElement).value = map.name;
    // reflect water controls
    (left.querySelector('.water-enabled') as HTMLInputElement).checked = map.water.enabled;
    (left.querySelector('.water-level') as HTMLInputElement).value = String(map.water.level);
    (left.querySelector('.water-color') as HTMLInputElement).value = map.water.color;
  }

  // ---- Save / delete ----
  function setSaveState(text: string) {
    (topbar.querySelector('.save-state') as HTMLElement).textContent = text;
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

  function buildInput(): MapInput {
    return {
      name: map.name,
      description: map.description,
      size: map.size,
      terrain: map.terrain,
      water: map.water,
      instances: map.instances,
      thumbnail: map.thumbnail,
    };
  }

  let saveTimer: any;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveCurrent();
    }, 800);
  }

  async function saveCurrent(): Promise<'created' | 'updated' | 'failed'> {
    const name = (topbar.querySelector('.name-input') as HTMLInputElement).value || 'Untitled Map';
    map.name = name;
    // Always refresh the snapshot from the current 3D viewport on save.
    try {
      map.thumbnail = viewport.captureThumbnail();
    } catch {
      /* thumbnail is best-effort */
    }
    try {
      if (savedId) {
        await updateMap(savedId, buildInput());
        return 'updated';
      }
      const created = await createMap(buildInput());
      savedId = created.id;
      map.id = created.id;
      map.createdAt = created.createdAt;
      map.updatedAt = created.updatedAt;
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
    if (confirm('确定删除该地图？')) {
      await deleteMap(savedId);
      location.hash = '#/maps';
    }
  });
}
