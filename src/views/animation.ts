import { navBar } from './_shared.ts';
import {
  type SceneComponent,
  type AssetComponent,
  type AnimComponent,
  type AnimChannel,
  type AnimKf,
  type AnimState,
  type SceneObject,
  createAnimationForScene,
  vec3,
} from '../schema';
import { AnimationViewport } from '../lib/anim-view.ts';
import {
  listScenes,
  getScene,
} from '../lib/scene-api.ts';
import {
  listAnimationsByScene,
  getAnimation,
  createAnimation,
  updateAnimation,
  deleteAnimation,
} from '../lib/anim-api.ts';
import { listAssets } from '../lib/api.ts';

const STATES: { value: AnimState; label: string }[] = [
  { value: 'none', label: '无 / 仅位移' },
  { value: 'walk', label: '走 Walk' },
  { value: 'fly', label: '飞 Fly' },
  { value: 'idle', label: '站立 Idle' },
  { value: 'sit', label: '坐 Sit' },
];

let uidCounter = 0;
function trackUid(): string {
  uidCounter += 1;
  return `track_${Date.now().toString(36)}_${uidCounter.toString(36)}`;
}

export async function renderAnimation(root: HTMLElement, id?: string) {
  const wrap = document.createElement('div');
  wrap.className = 'page editor-page';
  wrap.appendChild(navBar('animation'));
  root.appendChild(wrap);

  // ---- Layout ----
  const layout = document.createElement('div');
  layout.className = 'editor-layout';
  const left = document.createElement('div');
  left.className = 'panel anim-list';
  const center = document.createElement('div');
  center.className = 'panel viewport-panel';
  const right = document.createElement('div');
  right.className = 'panel inspector';
  layout.append(left, center, right);
  wrap.appendChild(layout);

  // ---- Center: toolbar + viewport ----
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar anim-toolbar';
  center.appendChild(toolbar);

  const viewportHost = document.createElement('div');
  viewportHost.className = 'viewport-host';
  center.appendChild(viewportHost);

  const viewport = new AnimationViewport(viewportHost);
  viewport.onTimeTick = (t) => {
    if (scrub) scrub.value = String(t);
    if (timeLabel) timeLabel.textContent = t.toFixed(2) + 's';
    updatePlayhead(t);
  };

  // ---- Top bar ----
  const topbar = document.createElement('div');
  topbar.className = 'editor-topbar';
  topbar.innerHTML = `
    <a class="btn small" href="#/scenes">← 返回</a>
    <input class="name-input" type="text" value="Untitled Animation" />
    <button class="btn primary" data-save>保存</button>
    <span class="save-state"></span>
  `;
  wrap.insertBefore(topbar, layout);

  // ---- State ----
  let scene: SceneComponent | null = null;
  let assets: AssetComponent[] = [];
  let anim: AnimComponent | null = null;
  let savedId: string | undefined = id;
  let selectedTrackId: string | null = null;
  let scrub: HTMLInputElement | null = null;
  let timeLabel: HTMLElement | null = null;

  function setSaveState(t: string) {
    (topbar.querySelector('.save-state') as HTMLElement).textContent = t;
  }
  function markDirty(msg: string) {
    setSaveState(msg + '（未保存）');
  }

  // ---- Left: scenes + animations + tracks ----
  async function renderLeft() {
    const scenes = await listScenes();
    left.innerHTML = '<h4>场景 Scenes</h4><div class="scene-items"></div>';
    const list = left.querySelector('.scene-items') as HTMLElement;
    for (const s of scenes) {
      const item = document.createElement('div');
      item.className = 'scene-item' + (scene && scene.id === s.id ? ' active' : '');
      item.innerHTML = `<span class="sname">${s.name}</span>`;
      item.addEventListener('click', () => selectScene(s.id));
      list.appendChild(item);
    }
  }

  async function selectScene(sid: string) {
    const s = await getScene(sid);
    if (!s) return;
    scene = s;
    assets = await listAssets();
    await viewport.setScene(scene, assets);
    (topbar.querySelector('.name-input') as HTMLInputElement).value = scene.name + ' 动画';
    savedId = undefined;
    anim = null;
    selectedTrackId = null;
    await renderAnimationsForScene(sid);
  }

  async function renderAnimationsForScene(sid: string) {
    const anims = await listAnimationsByScene(sid);
    let box = left.querySelector('.anim-items-box') as HTMLElement | null;
    if (!box) {
      box = document.createElement('div');
      box.className = 'anim-items-box';
      left.appendChild(box);
    }
    box.innerHTML = '<h4>动画 Animations</h4>';
    const newBtn = document.createElement('button');
    newBtn.className = 'btn small full';
    newBtn.textContent = '＋ 从场景创建动画';
    newBtn.addEventListener('click', () => createNewAnimation(sid));
    box.appendChild(newBtn);
    const list = document.createElement('div');
    list.className = 'anim-items';
    for (const a of anims) {
      const item = document.createElement('div');
      item.className = 'anim-item' + (savedId === a.id ? ' active' : '');
      item.innerHTML = `<span class="aname">${a.name}</span><button class="sdel" title="删除">×</button>`;
      item.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('sdel')) {
          if (confirm(`删除动画「${a.name}」？`)) {
            void deleteAnimation(a.id).then(() => { if (savedId === a.id) { anim = null; savedId = undefined; } renderAnimationsForScene(sid); });
          }
          return;
        }
        void loadAnimation(a.id);
      });
      list.appendChild(item);
    }
    box.appendChild(list);
  }

  async function createNewAnimation(sid: string) {
    const s = scene!;
    anim = createAnimationForScene(sid, s.name, s.size);
    savedId = undefined;
    selectedTrackId = null;
    (topbar.querySelector('.name-input') as HTMLInputElement).value = anim.name;
    viewport.setAnimation(anim);
    renderToolbar();
    renderRight();
    await renderAnimationsForScene(sid);
    markDirty('已新建（未保存）');
  }

  async function loadAnimation(aid: string) {
    const a = await getAnimation(aid);
    if (!a) return;
    if (!scene || scene.id !== a.sceneId) {
      const s = await getScene(a.sceneId);
      if (s) { scene = s; assets = await listAssets(); await viewport.setScene(scene, assets); }
    }
    anim = a;
    savedId = aid;
    selectedTrackId = null;
    (topbar.querySelector('.name-input') as HTMLInputElement).value = anim.name;
    viewport.setAnimation(anim);
    renderToolbar();
    renderRight();
    await renderAnimationsForScene(a.sceneId);
    setSaveState('');
  }

  // ---- Center toolbar ----
  function renderToolbar() {
    toolbar.innerHTML = `
      <button class="btn small" data-play>⏸ 暂停</button>
      <label class="field inline">时间 <input type="range" min="0" max="${anim?.duration ?? 8}" step="0.01" value="0" data-scrub /><span data-time>0.00s</span></label>
      <label class="field inline">速度 <input type="range" min="0.1" max="3" step="0.1" value="1" data-speed /><span data-speed-v>1.0</span></label>
      <label class="field inline">时长(s) <input type="number" min="0.1" step="0.1" value="${anim?.duration ?? 8}" data-dur style="width:60px"/></label>
      <span class="sep"></span>
      <button class="btn small primary" data-rec-cam>📷 记录相机/目标关键帧</button>
      <button class="btn small" data-rec-obj>🎯 记录选中物件关键帧</button>
    `;
    scrub = toolbar.querySelector('[data-scrub]') as HTMLInputElement;
    timeLabel = toolbar.querySelector('[data-time]') as HTMLElement;

    const playBtn = toolbar.querySelector('[data-play]') as HTMLElement;
    playBtn.addEventListener('click', () => {
      const next = !viewport.isPlaying();
      viewport.setPlaying(next);
      playBtn.textContent = next ? '⏸ 暂停' : '▶ 播放';
      if (!next) viewport.selectTrack(selectedTrackId);
    });
    scrub.addEventListener('input', () => {
      viewport.setTime(parseFloat(scrub!.value));
    });
    const speed = toolbar.querySelector('[data-speed]') as HTMLInputElement;
    const speedV = toolbar.querySelector('[data-speed-v]') as HTMLElement;
    speed.addEventListener('input', () => {
      viewport.setSpeed(parseFloat(speed.value) || 1);
      speedV.textContent = parseFloat(speed.value).toFixed(1);
    });
    const dur = toolbar.querySelector('[data-dur]') as HTMLInputElement;
    dur.addEventListener('input', () => {
      if (!anim) return;
      anim.duration = Math.max(0.1, parseFloat(dur.value) || 1);
      viewport.refresh();
      markDirty('时长已调整');
    });
    toolbar.querySelector('[data-rec-cam]')!.addEventListener('click', () => {
      viewport.recordCamera();
      markDirty('已记录相机关键帧');
      renderRight();
    });
    toolbar.querySelector('[data-rec-obj]')!.addEventListener('click', () => {
      if (selectedTrackId) {
        viewport.recordSelectedObject();
        markDirty('已记录物件关键帧');
        renderRight();
      }
    });
  }

  // ---- Right: tracks + inspector + timeline ----
  function renderRight() {
    right.innerHTML = `
      <h4>轨道 Tracks</h4>
      <div class="track-list"></div>
      <div class="add-track"></div>
      <div class="inspector-body"></div>
      <h4>时间轴 Timeline</h4>
      <div class="timeline-list"></div>
    `;
    renderTrackList();
    renderAddTrack();
    renderInspector();
    renderTimeline();
  }

  function boundObjectIds(): Set<string> {
    const set = new Set<string>();
    anim?.tracks.forEach((t) => { if (t.kind === 'object' && t.objectId) set.add(t.objectId); });
    return set;
  }

  function renderTrackList() {
    const host = right.querySelector('.track-list') as HTMLElement;
    if (!anim) { host.innerHTML = '<p class="muted">先选择一个场景并创建 / 加载动画。</p>'; return; }
    host.innerHTML = '';
    for (const t of anim.tracks) {
      const row = document.createElement('div');
      row.className = 'track-row' + (t.id === selectedTrackId ? ' selected' : '');
      const icon = t.kind === 'camera' ? '🎥' : t.kind === 'cameraTarget' ? '🎯' : '📦';
      const label = t.kind === 'camera' ? '相机 Camera' : t.kind === 'cameraTarget' ? '相机目标 Target' : t.label ?? '物件';
      const del = t.kind === 'object' ? `<button class="row-del" data-del-track="${t.id}" title="删除轨道">×</button>` : '';
      row.innerHTML = `<span class="ticon">${icon}</span><span class="tname">${label}</span>${del}`;
      row.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('row-del')) return;
        selectedTrackId = t.id;
        viewport.selectTrack(t.id);
        renderTrackList();
        renderInspector();
      });
      host.appendChild(row);
    }
  }

  function renderAddTrack() {
    const host = right.querySelector('.add-track') as HTMLElement;
    if (!scene) { host.innerHTML = ''; return; }
    const bound = boundObjectIds();
    const free = scene.objects.filter((o) => !bound.has(o.id));
    if (free.length === 0) { host.innerHTML = '<p class="muted tiny">场景中所有物件已绑定轨道（每个物件最多一个）。</p>'; return; }
    host.innerHTML = `
      <div class="add-track-row">
        <select class="obj-select" data-obj><option value="">绑定物件…</option>${free
          .map((o) => `<option value="${o.id}">${o.name}</option>`)
          .join('')}</select>
        <button class="btn tiny primary" data-add-track>＋ 添加轨道</button>
      </div>
      <p class="muted tiny">自定义轨道绑定场景中的角色 / 元件，可调整其位置并设区段动画状态（走 / 飞）。</p>
    `;
    host.querySelector('[data-add-track]')!.addEventListener('click', () => {
      const sel = host.querySelector('[data-obj]') as HTMLSelectElement;
      const oid = sel.value;
      if (!oid || !anim) return;
      addObjectTrack(oid);
    });
  }

  function findSceneObject(oid: string): SceneObject | undefined {
    return scene?.objects.find((o) => o.id === oid);
  }

  function addObjectTrack(oid: string) {
    const obj = findSceneObject(oid);
    if (!obj || !anim) return;
    const track: AnimChannel = {
      id: trackUid(),
      kind: 'object',
      objectId: oid,
      label: obj.name,
      keyframes: [
        { time: 0, position: { ...obj.position }, rotation: { ...obj.rotation }, scale: { ...obj.scale } },
      ],
    };
    anim.tracks.push(track);
    selectedTrackId = track.id;
    viewport.refresh();
    viewport.selectTrack(track.id);
    renderTrackList();
    renderAddTrack();
    renderInspector();
    renderTimeline();
    markDirty('已添加轨道');
  }

  function renderInspector() {
    const body = right.querySelector('.inspector-body') as HTMLElement;
    body.innerHTML = '';
    if (!anim || !selectedTrackId) {
      body.innerHTML = '<p class="muted">在上方选择一个轨道进行编辑；相机 / 目标轨道可用「记录关键帧」在时间轴上取景。</p>';
      return;
    }
    const track = anim.tracks.find((t) => t.id === selectedTrackId);
    if (!track) return;

    if (track.kind === 'camera' || track.kind === 'cameraTarget') {
      body.innerHTML = `<div class="group"><div class="group-title">${track.kind === 'camera' ? '相机' : '相机目标'} 轨道</div>
        <p class="muted">移动视角后用工具栏「记录相机/目标关键帧」在当前时间写入关键帧（空 node）。关键帧之间线性插值。</p></div>`;
      return;
    }

    // Object track inspector
    const obj = track.objectId ? findSceneObject(track.objectId) : undefined;
    if (!obj) { body.innerHTML = '<p class="muted">绑定的物件不存在。</p>'; return; }
    const title = document.createElement('div');
    title.className = 'group-title';
    title.textContent = `物件轨道：${track.label ?? obj.name}`;
    body.appendChild(title);

    // Transform mode buttons
    const modes = document.createElement('div');
    modes.className = 'toolbar-row';
    modes.innerHTML = `
      <span class="muted">变换：</span>
      <button class="btn tiny mode active" data-xmode="translate">移动</button>
      <button class="btn tiny mode" data-xmode="rotate">旋转</button>
      <button class="btn tiny mode" data-xmode="scale">缩放</button>`;
    modes.querySelectorAll('[data-xmode]').forEach((b) =>
      b.addEventListener('click', () => {
        viewport.setTransformMode((b as HTMLElement).getAttribute('data-xmode') as never);
        modes.querySelectorAll('.mode').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
      }),
    );
    body.appendChild(modes);

    // Transform at current keyframe (or create one)
    const kf = currentKeyframe(track);
    const make = (title: string, v: typeof obj.position, set: (nv: typeof v) => void) => {
      const g = document.createElement('div');
      g.className = 'group';
      g.innerHTML = `<div class="group-title">${title}</div>`;
      const box = document.createElement('div');
      box.className = 'vec3';
      (['x', 'y', 'z'] as const).forEach((ax, i) => {
        const w = document.createElement('label');
        w.className = 'field';
        w.innerHTML = `<span>${['X', 'Y', 'Z'][i]}</span>`;
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.step = '0.1';
        inp.value = String(v[ax]);
        inp.addEventListener('input', () => { set({ ...v, [ax]: parseFloat(inp.value) || 0 }); });
        w.appendChild(inp);
        box.appendChild(w);
      });
      g.appendChild(box);
      body.appendChild(g);
    };
    make('位置 Position', kf.position, (nv) => { writeKF(track, viewport.getTime(), nv, kf.rotation, kf.scale); syncObj(obj, track); });
    make('旋转 Rotation (rad)', kf.rotation, (nv) => { writeKF(track, viewport.getTime(), kf.position, nv, kf.scale); syncObj(obj, track); });
    make('缩放 Scale', kf.scale, (nv) => { writeKF(track, viewport.getTime(), kf.position, kf.rotation, nv); syncObj(obj, track); });

    // State for the segment leading into this keyframe
    const stateWrap = document.createElement('div');
    stateWrap.className = 'group';
    stateWrap.innerHTML = `<div class="group-title">区段动画状态 Segment State</div>`;
    const sel = document.createElement('select');
    sel.className = 'state-select';
    sel.innerHTML = STATES.map((s) => `<option value="${s.value}" ${kf.state === s.value ? 'selected' : ''}>${s.label}</option>`).join('');
    sel.addEventListener('change', () => {
      const k = currentKeyframe(track, true);
      k.state = sel.value as AnimState;
      viewport.refresh();
      markDirty('状态已设置');
      renderTimeline();
    });
    stateWrap.appendChild(sel);
    body.appendChild(stateWrap);

    // Keyframe list with time editing + delete
    const kfList = document.createElement('div');
    kfList.className = 'group';
    kfList.innerHTML = '<div class="group-title">关键帧 Keyframes</div>';
    track.keyframes.forEach((k, idx) => {
      const r = document.createElement('div');
      r.className = 'kf-row';
      r.innerHTML = `<span class="kf-time">t</span>`;
      const ti = document.createElement('input');
      ti.type = 'number';
      ti.step = '0.1';
      ti.min = '0';
      ti.value = k.time.toFixed(2);
      ti.addEventListener('input', () => {
        k.time = Math.max(0, Math.min(anim!.duration, parseFloat(ti.value) || 0));
        track.keyframes.sort((a, b) => a.time - b.time);
        viewport.refresh();
        renderTimeline();
      });
      const st = document.createElement('select');
      st.innerHTML = STATES.map((s) => `<option value="${s.value}" ${k.state === s.value ? 'selected' : ''}>${s.label}</option>`).join('');
      st.addEventListener('change', () => { k.state = st.value as AnimState; viewport.refresh(); renderTimeline(); });
      const del = document.createElement('button');
      del.className = 'row-del';
      del.textContent = '×';
      del.addEventListener('click', () => {
        track.keyframes.splice(idx, 1);
        viewport.refresh();
        renderInspector();
        renderTimeline();
        markDirty('已删除关键帧');
      });
      r.append(ti, st, del);
      kfList.appendChild(r);
    });
    body.appendChild(kfList);
  }

  function syncObj(obj: SceneObject, track: AnimChannel) {
    const kf = currentKeyframe(track);
    obj.position = { ...kf.position };
    obj.rotation = { ...kf.rotation };
    obj.scale = { ...kf.scale };
    viewport.setSelectedObjectTransform(obj);
    markDirty('已调整关键帧');
  }

  /** Get (or create) the keyframe at the current time on a track. */
  function currentKeyframe(track: AnimChannel, create = false): AnimKf {
    const t = viewport.getTime();
    let kf = track.keyframes.find((k) => Math.abs(k.time - t) < 1e-3);
    if (!kf && create) {
      const obj = track.objectId ? findSceneObject(track.objectId) : undefined;
      kf = {
        time: t,
        position: obj ? { ...obj.position } : vec3(),
        rotation: obj ? { ...obj.rotation } : vec3(),
        scale: obj ? { ...obj.scale } : vec3(1, 1, 1),
      };
      track.keyframes.push(kf);
      track.keyframes.sort((a, b) => a.time - b.time);
    }
    if (!kf) kf = track.keyframes[0] ?? { time: t, position: vec3(), rotation: vec3(), scale: vec3(1, 1, 1) };
    return kf;
  }

  function writeKF(track: AnimChannel, time: number, pos: { x: number; y: number; z: number }, rot?: { x: number; y: number; z: number }, scale?: { x: number; y: number; z: number }) {
    let kf = track.keyframes.find((k) => Math.abs(k.time - time) < 1e-3);
    if (!kf) {
      kf = { time, position: { ...pos }, rotation: rot ?? vec3(), scale: scale ?? vec3(1, 1, 1) };
      track.keyframes.push(kf);
      track.keyframes.sort((a, b) => a.time - b.time);
    }
    kf.position = { ...pos };
    if (rot) kf.rotation = { ...rot };
    if (scale) kf.scale = { ...scale };
    viewport.refresh();
    markDirty('已调整关键帧');
  }

  function renderTimeline() {
    const host = right.querySelector('.timeline-list') as HTMLElement;
    if (!anim) { host.innerHTML = ''; return; }
    const dur = anim.duration;
    host.innerHTML = '';
    for (const t of anim.tracks) {
      const row = document.createElement('div');
      row.className = 'tl-track' + (t.id === selectedTrackId ? ' selected' : '');
      const label = t.kind === 'camera' ? '🎥' : t.kind === 'cameraTarget' ? '🎯' : '📦';
      row.innerHTML = `<span class="tl-label">${label}</span><div class="tl-bar" data-track="${t.id}"></div>`;
      const bar = row.querySelector('.tl-bar') as HTMLElement;
      for (const kf of t.keyframes) {
        const dot = document.createElement('span');
        dot.className = 'tl-dot' + (kf.state && kf.state !== 'none' ? ' has-state' : '');
        dot.style.left = ((kf.time / dur) * 100).toFixed(2) + '%';
        dot.title = `t=${kf.time.toFixed(2)}s${kf.state && kf.state !== 'none' ? ' · ' + kf.state : ''}`;
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          viewport.setTime(kf.time);
          if (t.kind === 'object') { selectedTrackId = t.id; viewport.selectTrack(t.id); renderTrackList(); }
        });
        bar.appendChild(dot);
      }
      // playhead
      const ph = document.createElement('span');
      ph.className = 'tl-playhead';
      bar.appendChild(ph);
      bar.addEventListener('click', (e) => {
        const r = bar.getBoundingClientRect();
        const tt = Math.max(0, Math.min(dur, ((e.clientX - r.left) / r.width) * dur));
        viewport.setTime(tt);
      });
      row.addEventListener('click', () => {
        if (t.kind === 'object') { selectedTrackId = t.id; viewport.selectTrack(t.id); renderTrackList(); renderInspector(); }
      });
      host.appendChild(row);
    }
    updatePlayhead(viewport.getTime());
  }

  function updatePlayhead(t: number) {
    if (!anim) return;
    const dur = anim.duration;
    right.querySelectorAll('.tl-bar').forEach((bar) => {
      const ph = bar.querySelector('.tl-playhead') as HTMLElement | null;
      if (ph) ph.style.left = ((t / dur) * 100).toFixed(2) + '%';
    });
  }

  // ---- Save ----
  topbar.querySelector('[data-save]')!.addEventListener('click', async () => {
    if (!anim || !scene) { setSaveState('请先选择场景'); return; }
    const name = (topbar.querySelector('.name-input') as HTMLInputElement).value || 'Untitled Animation';
    anim.name = name;
    anim.thumbnail = viewport.captureThumbnail();
    const input = {
      name: anim.name,
      sceneId: scene.id,
      duration: anim.duration,
      tracks: anim.tracks,
      thumbnail: anim.thumbnail,
    };
    try {
      if (savedId) await updateAnimation(savedId, input);
      else { const created = await createAnimation(input); savedId = created.id; }
      setSaveState('已保存 ✓');
    } catch (err) {
      setSaveState('保存失败：' + (err as Error).message);
    }
  });

  // ---- Init ----
  await renderLeft();
  if (id) await loadAnimation(id);
  else { renderToolbar(); renderRight(); }
}
