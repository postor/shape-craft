import { navBar, categoryLabel } from './_shared.ts';
import { getAsset, createAsset, updateAsset, deleteAsset, listAssets } from '../lib/api.ts';
import {
  AssetComponent,
  AssetPart,
  createPart,
  createEmptyAsset,
  defaultMaterial,
  vec3,
  CHARACTER_TYPES,
  CHARACTER_TYPE_LABEL,
  CHARACTER_CLIPS,
  buildCharacterAsset,
  CharacterType,
  AnimClip,
  AnimTrack,
} from '../schema';
import { Viewport } from '../lib/three-view.ts';
import { createDimensionOverlay } from '../lib/ruler.ts';
import { resolveRefs, buildInstanceReference, findPart, type RefMap } from '../lib/instance.ts';
import { CharacterAnimator } from '../lib/character-anim.ts';

export async function renderCharacters(root: HTMLElement, type?: string, id?: string) {
  const wrap = document.createElement('div');
  wrap.className = 'page editor-page';
  wrap.appendChild(navBar('characters'));
  root.appendChild(wrap);

  let asset: AssetComponent;
  let savedId: string | undefined = id;
  let characterType: CharacterType = (CHARACTER_TYPES as string[]).includes(type ?? '')
    ? (type as CharacterType)
    : 'humanoid';

  if (id) {
    const existing = await getAsset(id);
    if (existing) {
      asset = existing;
      if (existing.characterType) characterType = existing.characterType;
    } else {
      asset = createEmptyAsset('Untitled', 'character');
    }
  } else {
    asset = { ...createEmptyAsset(characterType, 'character'), ...buildCharacterAsset(characterType) } as AssetComponent;
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
      <span class="muted">类别：</span>
      ${CHARACTER_TYPES.map(
        (t) =>
          `<button class="chip ${t === characterType ? 'active' : ''}" data-type="${t}">${CHARACTER_TYPE_LABEL[t]}</button>`,
      ).join('')}
    </div>
    <div class="toolbar-row">
      <span class="muted">变换：</span>
      <button class="btn small mode active" data-mode="rotate">旋转</button>
      <button class="btn small mode" data-mode="translate">拖拽</button>
      <button class="btn small mode" data-mode="scale">缩放</button>
      <span class="sep"></span>
      <button class="btn small" data-shot>📷 截图</button>
    </div>
    <div class="toolbar-row">
      <span class="muted">添加：</span>
      <button class="btn small" data-add="box">Box</button>
      <button class="btn small" data-add="sphere">Sphere</button>
      <button class="btn small" data-add="cylinder">Cylinder</button>
      <button class="btn small" data-add="cone">Cone</button>
      <button class="btn small" data-add="plane">Plane</button>
      <button class="btn small" data-add="node">Node</button>
    </div>
    <div class="toolbar-row">
      <span class="muted">引用：</span>
      <select class="ref-select" data-ref-select><option value="">选择元件…</option></select>
      <button class="btn small" data-insert-ref>插入引用</button>
    </div>
  `;
  center.appendChild(toolbar);

  const viewportHost = document.createElement('div');
  viewportHost.className = 'viewport-host';
  center.appendChild(viewportHost);

  const viewport = new Viewport(
    viewportHost,
    (pid) => selectPart(pid),
    (pid, t) => applyTransform(pid, t),
  );
  const animator = new CharacterAnimator(viewport.getRootGroup());
  animator.setClips(getClips());
  viewport.onFrame((dt) => animator.update(dt));

  const updateDimensions = createDimensionOverlay(viewportHost);

  // ---- Top bar ----
  const topbar = document.createElement('div');
  topbar.className = 'editor-topbar';
  topbar.innerHTML = `
    <a class="btn small" href="#/library">← 返回</a>
    <input class="name-input" type="text" value="${asset.name}" />
    <span class="badge">${categoryLabel('character')}</span>
    <button class="btn primary" data-save>保存</button>
    ${savedId ? '<button class="btn danger" data-del>删除</button>' : ''}
    <span class="save-state"></span>
  `;
  wrap.insertBefore(topbar, layout);

  let selectedId: string | null = null;
  let activeClip: string | null = null;
  const collapsedClips = new Set<number>();
  let selectedKf: { clip: number; track: number; kf: number } | null = null;

  /** Editable script slots: persisted on the asset, falling back to presets. */
  function getClips(): AnimClip[] {
    if (!asset.animClips) asset.animClips = cloneClips(CHARACTER_CLIPS[characterType]);
    return asset.animClips;
  }
  /** Push the current slots into the runtime player and keep playing. */
  function applyClips() {
    animator.setClips(getClips());
    animator.rebind(viewport.getRootGroup());
    if (activeClip) animator.play(activeClip);
  }
  /** Names of all node parts (rig bones) — the valid reference targets. */
  function boneList(): string[] {
    const out: string[] = [];
    const walk = (p: AssetPart) => {
      if (p.shape === 'node') out.push(p.name);
      p.children.forEach(walk);
    };
    walk(asset.root);
    return out;
  }

  // ---- Left hierarchy ----
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
    left.innerHTML = '<h4>骨架层级</h4><div class="tree"></div>';
    const tree = left.querySelector('.tree')!;
    tree.appendChild(partNode(asset.root, true));
  }

  function partNode(part: AssetPart, isRoot: boolean): HTMLElement {
    const row = document.createElement('div');
    row.className = 'tree-row' + (viewport.getSelectedId() === part.id ? ' selected' : '');
    const lock = part.shape === 'instance' ? '<span class="lock" title="实例引用（整体锁定）">🔒</span>' : '';
    row.innerHTML = `<span class="dot ${part.shape}"></span><span class="pname">${part.name}</span><span class="pshape">${part.shape}</span>${lock}<button class="row-del" title="删除" data-del-id="${part.id}">×</button>`;
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

  function selectPart(pid: string | null) {
    selectedId = pid;
    viewport.setSelected(pid);
    renderHierarchy();
    renderInspectorBody();
  }

  function applyTransform(pid: string, t: { position: any; rotation: any; scale: any }) {
    const part = findPart(asset.root, pid);
    if (!part) return;
    part.position = t.position;
    part.rotation = t.rotation;
    part.scale = t.scale;
    renderInspectorBody();
  }

  // ---- Right: animation panel + inspector ----
  function buildRightPanel() {
    right.innerHTML = `
      <h4>动画 Animation</h4>
      <div class="anim-panel"></div>
      <h4>属性 Inspector</h4>
      <div class="inspector-body"></div>
    `;
    renderAnimPanel(right.querySelector('.anim-panel') as HTMLElement);
    renderInspectorBody();
  }

  function renderAnimPanel(host: HTMLElement) {
    const clips = getClips();
    const bones = boneList();
    const deg = (r: number) => Math.round((r * 180) / Math.PI);

    const kfDot = (ci: number, ti: number, kf: { t: number; value: number }, ki: number) => {
      const sel = selectedKf && selectedKf.clip === ci && selectedKf.track === ti && selectedKf.kf === ki;
      return `<span class="kf-dot${sel ? ' selected' : ''}" style="left:${(kf.t * 100).toFixed(2)}%" data-kf="${ci}:${ti}:${ki}" title="t=${kf.t.toFixed(2)} · ${deg(kf.value)}°"></span>`;
    };

    const timelineRow = (ci: number, tr: AnimTrack, ti: number) => `
      <div class="track-row">
        <span class="track-label" title="${tr.joint}">${tr.joint}·${tr.axis}</span>
        <div class="timeline" data-timeline="${ci}:${ti}">
          ${tr.keyframes.map((kf, ki) => kfDot(ci, ti, kf, ki)).join('')}
          <span class="tl-zero">0</span><span class="tl-one">1</span>
        </div>
        <button class="row-del" title="删除轨道" data-del-track="${ci}:${ti}">×</button>
      </div>`;

    const selectedEditor = (ci: number) => {
      if (!selectedKf || selectedKf.clip !== ci) return '';
      const tr = clips[ci].tracks[selectedKf.track];
      const kf = tr.keyframes[selectedKf.kf];
      return `<div class="kf-editor">
        <span class="kf-tag">选中关键帧：${tr.joint} · ${tr.axis}</span>
        <label class="mini">值°<input type="number" step="1" value="${deg(kf.value)}" data-kf-val="${ci}:${selectedKf.track}:${selectedKf.kf}"/></label>
        <button class="btn tiny danger" data-kf-del="${ci}:${selectedKf.track}:${selectedKf.kf}">删除关键帧</button>
      </div>`;
    };

    const clipBody = (ci: number, clip: AnimClip) => `
      <div class="clip-body">
        <label class="mini">时长(s)<input type="number" step="0.1" min="0.1" value="${clip.duration}" data-clip-dur="${ci}"/></label>
        <div class="track-builder">
          <label class="mini">引用节点<input list="bone-list" value="${bones[0] ?? ''}" data-builder-joint="${ci}"/></label>
          <span class="axis-checks">
            ${['x', 'y', 'z'].map((a) => `<label><input type="checkbox" data-builder-axis="${ci}:${a}"/>${a.toUpperCase()}</label>`).join('')}
          </span>
          <button class="btn tiny" data-add-tracks="${ci}">＋ 添加轨道</button>
          <span class="muted tiny-hint">勾选轴后，为该节点一次生成多条轨道</span>
        </div>
        <div class="tracks">${clip.tracks.map((tr, ti) => timelineRow(ci, tr, ti)).join('')}</div>
        ${selectedEditor(ci)}
      </div>`;

    const clipCards = clips
      .map((clip, i) => {
        const open = !collapsedClips.has(i);
        return `
        <div class="clip-card ${activeClip === clip.name ? 'active' : ''}" data-clip="${i}">
          <div class="clip-head">
            <button class="btn tiny play-clip" data-play-clip="${i}">▶</button>
            <input class="clip-label" type="text" value="${clip.label}" data-clip-label="${i}"/>
            <input class="clip-name" type="text" value="${clip.name}" data-clip-name="${i}" title="槽位标识"/>
            <button class="row-del" title="删除槽位" data-del-clip="${i}">×</button>
            <button class="btn tiny" data-toggle-clip="${i}">${open ? '收起' : '展开'}</button>
          </div>
          ${open ? clipBody(i, clip) : ''}
        </div>`;
      })
      .join('');

    host.innerHTML = `
      <datalist id="bone-list">${bones.map((n) => `<option value="${n}">`).join('')}</datalist>
      <div class="anim-buttons">
        <button class="btn small primary" data-add-clip>+ 新增槽位</button>
      </div>
      <div class="clip-list">${clipCards}</div>
      <div class="anim-controls">
        <button class="btn small" data-play>⏸ 暂停</button>
        <label class="field"><span>速度 Speed</span>
          <input type="range" min="0.1" max="3" step="0.1" value="1" data-speed />
        </label>
        <label class="field"><span>朝向角度 Yaw</span>
          <input type="range" min="-180" max="180" step="1" value="0" data-yaw />
        </label>
      </div>
      <p class="muted anim-hint">脚本槽位 = 一段动画。先选“引用节点”，勾选 X/Y/Z 一次生成多条轨道；在轨道时间轴上<strong>点空白加关键帧、点圆点选中并拖动改时间</strong>，选中后在下方填角度（度）即可驱动该节点旋转。</p>
    `;

    // ---- wiring ----
    host.querySelectorAll('[data-play-clip]').forEach((b) =>
      b.addEventListener('click', () => {
        const i = Number((b as HTMLElement).getAttribute('data-play-clip'));
        const clip = getClips()[i];
        if (!clip) return;
        activeClip = clip.name;
        animator.play(clip.name);
        host.querySelectorAll('.clip-card').forEach((c) => c.classList.remove('active'));
        (b.closest('.clip-card') as HTMLElement).classList.add('active');
        host.querySelector('[data-play]')!.textContent = '⏸ 暂停';
      }),
    );

    host.querySelector('[data-play]')!.addEventListener('click', (e) => {
      const btn = e.target as HTMLElement;
      const next = !animator.isPlaying();
      animator.setPlaying(next);
      btn.textContent = next ? '⏸ 暂停' : '▶ 播放';
    });

    const speed = host.querySelector('[data-speed]') as HTMLInputElement;
    speed.addEventListener('input', () => animator.setSpeed(parseFloat(speed.value) || 1));

    const yaw = host.querySelector('[data-yaw]') as HTMLInputElement;
    yaw.addEventListener('input', () => {
      const d = (parseFloat(yaw.value) * Math.PI) / 180;
      viewport.getRootGroup().rotation.y = d;
    });

    // value-only edits (no re-render → keep focus)
    host.querySelectorAll('[data-clip-label]').forEach((el) =>
      el.addEventListener('input', () => {
        getClips()[Number((el as HTMLElement).getAttribute('data-clip-label'))].label = (el as HTMLInputElement).value;
      }),
    );
    host.querySelectorAll('[data-clip-name]').forEach((el) =>
      el.addEventListener('input', () => {
        getClips()[Number((el as HTMLElement).getAttribute('data-clip-name'))].name = (el as HTMLInputElement).value;
      }),
    );
    host.querySelectorAll('[data-clip-dur]').forEach((el) =>
      el.addEventListener('input', () => {
        const i = Number((el as HTMLElement).getAttribute('data-clip-dur'));
        getClips()[i].duration = Math.max(0.1, parseFloat((el as HTMLInputElement).value) || 1);
        applyClips();
      }),
    );

    // timeline: click empty → add keyframe; click dot → select; drag → move t
    host.querySelectorAll('[data-timeline]').forEach((tl) =>
      (tl as HTMLElement).addEventListener('pointerdown', (e: PointerEvent) => {
        e.preventDefault();
        const [ci, ti] = (tl as HTMLElement).getAttribute('data-timeline')!.split(':').map(Number);
        const dot = (e.target as HTMLElement).closest('.kf-dot') as HTMLElement | null;
        let kfIdx: number;
        if (dot) {
          kfIdx = Number(dot.getAttribute('data-kf')!.split(':')[2]);
        } else {
          const r = (tl as HTMLElement).getBoundingClientRect();
          const t = Math.min(1, Math.max(0, ((e as PointerEvent).clientX - r.left) / r.width));
          const kfs = getClips()[ci].tracks[ti].keyframes;
          kfs.push({ t, value: 0 });
          kfIdx = kfs.length - 1;
        }
        selectedKf = { clip: ci, track: ti, kf: kfIdx };

        const move = (ev: PointerEvent) => {
          const cur = host.querySelector(`[data-timeline="${ci}:${ti}"]`) as HTMLElement | null;
          if (!cur) return;
          const r = cur.getBoundingClientRect();
          const t = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
          getClips()[ci].tracks[ti].keyframes[kfIdx].t = t;
          const dotEl = cur.querySelector(`[data-kf="${ci}:${ti}:${kfIdx}"]`) as HTMLElement | null;
          if (dotEl) dotEl.style.left = (t * 100).toFixed(2) + '%';
          applyClips();
        };
        const up = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          renderAnimPanel(host);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        renderAnimPanel(host);
      }),
    );

    // add tracks for the joint + checked axes
    host.querySelectorAll('[data-add-tracks]').forEach((b) =>
      b.addEventListener('click', () => {
        const ci = Number((b as HTMLElement).getAttribute('data-add-tracks'));
        const jointEl = host.querySelector(`[data-builder-joint="${ci}"]`) as HTMLInputElement;
        const joint = jointEl.value.trim() || bones[0] || 'joint.root';
        const tracks = getClips()[ci].tracks;
        for (const a of ['x', 'y', 'z'] as const) {
          const cb = host.querySelector(`[data-builder-axis="${ci}:${a}"]`) as HTMLInputElement | null;
          if (cb?.checked && !tracks.some((t) => t.joint === joint && t.axis === a)) {
            tracks.push({ joint, axis: a, keyframes: [{ t: 0, value: 0 }, { t: 1, value: 0 }] });
          }
        }
        applyClips();
        renderAnimPanel(host);
      }),
    );

    host.querySelectorAll('[data-kf-val]').forEach((el) =>
      el.addEventListener('input', () => {
        const [ci, ti, ki] = (el as HTMLElement).getAttribute('data-kf-val')!.split(':').map(Number);
        getClips()[ci].tracks[ti].keyframes[ki].value = (parseFloat((el as HTMLInputElement).value) || 0) * (Math.PI / 180);
        applyClips();
      }),
    );
    host.querySelectorAll('[data-kf-del]').forEach((el) =>
      el.addEventListener('click', () => {
        const [ci, ti, ki] = (el as HTMLElement).getAttribute('data-kf-del')!.split(':').map(Number);
        const kfs = getClips()[ci].tracks[ti].keyframes;
        if (kfs.length > 1) kfs.splice(ki, 1);
        if (selectedKf && selectedKf.clip === ci && selectedKf.track === ti && selectedKf.kf === ki) selectedKf = null;
        applyClips();
        renderAnimPanel(host);
      }),
    );
    host.querySelectorAll('[data-del-track]').forEach((el) =>
      el.addEventListener('click', () => {
        const [ci, ti] = (el as HTMLElement).getAttribute('data-del-track')!.split(':').map(Number);
        getClips()[ci].tracks.splice(ti, 1);
        if (selectedKf && selectedKf.clip === ci && selectedKf.track === ti) selectedKf = null;
        applyClips();
        renderAnimPanel(host);
      }),
    );
    host.querySelectorAll('[data-del-clip]').forEach((el) =>
      el.addEventListener('click', () => {
        const i = Number((el as HTMLElement).getAttribute('data-del-clip'));
        getClips().splice(i, 1);
        if (selectedKf && selectedKf.clip === i) selectedKf = null;
        applyClips();
        renderAnimPanel(host);
      }),
    );
    host.querySelectorAll('[data-toggle-clip]').forEach((el) =>
      el.addEventListener('click', () => {
        const i = Number((el as HTMLElement).getAttribute('data-toggle-clip'));
        if (collapsedClips.has(i)) collapsedClips.delete(i);
        else collapsedClips.add(i);
        renderAnimPanel(host);
      }),
    );
    host.querySelector('[data-add-clip]')!.addEventListener('click', () => {
      const cl = getClips();
      const n = cl.filter((c) => c.name.startsWith('custom')).length + 1;
      cl.push({ name: `custom${n}`, label: `Custom ${n}`, duration: 1, tracks: [] });
      applyClips();
      renderAnimPanel(host);
    });
  }

  function renderInspectorBody() {
    const body = right.querySelector('.inspector-body') as HTMLElement;
    const part = selectedId ? findPart(asset.root, selectedId) : null;
    body.innerHTML = '';
    if (!part) {
      body.innerHTML = '<p class="muted">在视图或骨架中选中一个节点以编辑其变换与材质。</p>';
      return;
    }
    body.appendChild(inspectorForm(part));
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

    const mk = (title: string, v: { x: number; y: number; z: number }, set: (v: { x: number; y: number; z: number }) => void) => {
      const g = document.createElement('div');
      g.className = 'group';
      g.innerHTML = `<div class="group-title">${title}</div>`;
      g.appendChild(vec3Fields(title, v, set));
      return g;
    };
    form.appendChild(mk('位置 Position', part.position, (v) => { part.position = v; refresh(); }));
    form.appendChild(mk('旋转 Rotation (rad)', part.rotation, (v) => { part.rotation = v; refresh(); }));
    form.appendChild(mk('缩放 Scale', part.scale, (v) => { part.scale = v; refresh(); }));

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
  function addPrimitive(shape: AssetPart['shape']) {
    let parent = (selectedId && findPart(asset.root, selectedId)) || asset.root;
    if (parent.shape === 'instance') parent = asset.root;
    const isNode = shape === 'node';
    const part = createPart({
      shape,
      name: isNode ? `Node ${parent.children.length + 1}` : `${shape[0].toUpperCase()}${shape.slice(1)} ${parent.children.length + 1}`,
      material: defaultMaterial(shape === 'sphere' || shape === 'cone' ? '#4caf50' : '#cccccc'),
      size: shape === 'box' ? vec3(0.3, 0.3, 0.3) : shape === 'sphere' ? vec3(0.2, 0.2, 0.2) : shape === 'plane' ? vec3(0.5, 0.5, 1) : vec3(0.15, 0.5, 0.15),
      position: vec3(0, isNode ? 0 : 0.2, 0),
    });
    parent.children.push(part);
    selectPart(part.id);
    refresh();
  }

  function refresh() {
    return resolveRefs(asset.root).then((refs: RefMap) => {
      viewport.setRoot(asset.root, (id) => refs.get(id) ?? null);
      animator.rebind(viewport.getRootGroup());
      if (selectedId) viewport.setSelected(selectedId);
    });
  }
  function refreshAll() {
    void refresh();
    updateDimensions(viewport.getDimensions());
    renderHierarchy();
    renderInspectorBody();
  }

  /** Fill the "insert reference" dropdown with every saved asset. */
  async function populateRefs() {
    const sel = toolbar.querySelector('[data-ref-select]') as HTMLSelectElement | null;
    if (!sel) return;
    const assets = await listAssets();
    const current = sel.value;
    sel.innerHTML =
      '<option value="">选择元件…</option>' +
      assets
        .filter((a) => a.id !== savedId)
        .map((a) => `<option value="${a.id}">${a.name} · ${a.category}</option>`)
        .join('');
    if (assets.some((a) => a.id === current)) sel.value = current;
  }

  toolbar.addEventListener('click', async (e) => {
    const btn = e.target as HTMLElement;
    const typeSel = btn.getAttribute?.('data-type');
    const mode = btn.getAttribute?.('data-mode');
    const shot = btn.hasAttribute?.('data-shot');
    const add = btn.getAttribute?.('data-add');
    if (add) {
      addPrimitive(add as AssetPart['shape']);
      return;
    }
    const insertRef = btn.hasAttribute?.('data-insert-ref');
    if (insertRef) {
      const sel = toolbar.querySelector('[data-ref-select]') as HTMLSelectElement | null;
      const refId = sel?.value;
      if (!refId) return;
      const refAsset = (await listAssets()).find((a) => a.id === refId);
      const inst = buildInstanceReference({
        root: asset.root,
        selectedId,
        refId,
        refName: refAsset?.name ?? 'Instance',
      });
      selectPart(inst.id);
      refreshAll();
      return;
    }
    if (typeSel && typeSel !== characterType) {
      characterType = typeSel as CharacterType;
      asset = { ...createEmptyAsset(characterType, 'character'), ...buildCharacterAsset(characterType) } as AssetComponent;
      savedId = undefined;
      collapsedClips.clear();
      const first = getClips()[0];
      activeClip = first ? first.name : null;
      applyClips();
      (topbar.querySelector('.name-input') as HTMLInputElement).value = asset.name;
      selectPart(null);
      refreshAll();
      buildRightPanel();
      return;
    }
    if (mode) {
      viewport.setTransformMode(mode as 'translate' | 'rotate' | 'scale');
      toolbar.querySelectorAll('.mode').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    }
    if (shot) {
      asset.thumbnail = viewport.captureThumbnail();
      if (savedId) {
        void updateAsset(savedId, buildInput());
        setSaveState('已截图并保存 ✓');
      } else {
        setSaveState('已截图（保存后将按当前视图刷新）');
      }
    }
  });

  // ---- Save / delete ----
  function setSaveState(text: string) {
    (topbar.querySelector('.save-state') as HTMLElement).textContent = text;
  }
  function ensureDelButton() {
    if (!topbar.querySelector('[data-del]')) {
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
      characterType,
      animClips: getClips(),
    };
  }
  async function saveCurrent(): Promise<'created' | 'updated' | 'failed'> {
    const name = (topbar.querySelector('.name-input') as HTMLInputElement).value || 'Untitled';
    asset.name = name;
    asset.category = 'character';
    asset.thumbnail = viewport.captureThumbnail();
    try {
      if (savedId) {
        await updateAsset(savedId, buildInput());
        return 'updated';
      }
      const created = await createAsset(buildInput());
      savedId = created.id;
      asset.id = created.id;
      asset.createdAt = created.createdAt;
      asset.updatedAt = created.updatedAt;
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
    if (status !== 'failed') setSaveState('已保存到元件库 ✓');
  });
  topbar.querySelector('[data-del]')?.addEventListener('click', async () => {
    if (!savedId) return;
    if (confirm('确定删除该角色？')) {
      await deleteAsset(savedId);
      location.hash = '#/library';
    }
  });

  // initial render
  buildRightPanel();
  void populateRefs();
  const first = getClips()[0];
  if (first) {
    activeClip = first.name;
    animator.play(first.name);
  }
  refreshAll();
}

// ---- tree helpers ----
function cloneClips(clips: AnimClip[]): AnimClip[] {
  return clips.map((c) => ({
    ...c,
    tracks: c.tracks.map((t) => ({ ...t, keyframes: t.keyframes.map((k) => ({ ...k })) })),
  }));
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
