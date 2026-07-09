import {
  type AssetComponent,
  type SceneComponent,
  type RecordSession,
} from '../schema';
import { PlayViewport, type PlayMode as PlayModeType } from '../lib/play-view.ts';
import { listScenes, getScene } from '../lib/scene-api.ts';
import { listAssets } from '../lib/api.ts';
import { createAnimation } from '../lib/anim-api.ts';
import {
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../lib/record-api.ts';

// ===========================================================================
// /record — history list: create a new recording or open an existing one.
// ===========================================================================

export async function renderRecordList(root: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'record-list-page';

  const topbar = document.createElement('div');
  topbar.className = 'editor-topbar';
  topbar.innerHTML = `
    <span class="muted">扮演录制</span>
    <span class="rec-state"></span>
  `;
  wrap.appendChild(topbar);

  const body = document.createElement('div');
  body.className = 'record-list-body';
  wrap.appendChild(body);
  root.appendChild(wrap);

  const setState = (t: string) => {
    (topbar.querySelector('.rec-state') as HTMLElement).textContent = t;
  };

  async function render() {
    const [records, scenes] = await Promise.all([listRecords(), listScenes()]);
    const sceneName = (id: string | null) =>
      id ? scenes.find((s) => s.id === id)?.name ?? '（场景已删除）' : '未选择场景';

    body.innerHTML = '';

    const newBtn = document.createElement('button');
    newBtn.className = 'btn primary full';
    newBtn.textContent = '＋ 新建录制';
    newBtn.addEventListener('click', async () => {
      const rec = await createRecord({
        name: '未命名录制',
        sceneId: null,
        tracks: [],
        cameraTrack: null,
      });
      location.hash = `#/record/${rec.id}`;
    });
    body.appendChild(newBtn);

    const list = document.createElement('div');
    list.className = 'record-items';
    if (records.length === 0) {
      list.innerHTML = '<p class="muted">还没有录制。点击「新建录制」开始。</p>';
    }
    for (const r of records) {
      const item = document.createElement('div');
      item.className = 'record-item';
      const objCount = r.tracks.length;
      const cam = r.cameraTrack ? ' · 🎥相机' : '';
      const updated = new Date(r.updatedAt).toLocaleString();
      item.innerHTML = `
        <div class="ri-main">
          <span class="ri-name">${r.name}</span>
          <span class="ri-meta">${sceneName(r.sceneId)} · ${objCount} 轨道${cam}</span>
        </div>
        <span class="ri-time">${updated}</span>
        <button class="ri-del" title="删除">×</button>
      `;
      item.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('ri-del')) return;
        location.hash = `#/record/${r.id}`;
      });
      item.querySelector('.ri-del')!.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm(`删除录制「${r.name}」？`)) {
          await deleteRecord(r.id);
          render();
        }
      });
      list.appendChild(item);
    }
    body.appendChild(list);
  }

  await render();
  setState('');
}

// ===========================================================================
// /record/:id — editor for one rec.
// ===========================================================================

export async function renderPlay(root: HTMLElement, id?: string) {
  if (!id) {
    location.hash = '#/record';
    return;
  }
  const session = await getRecord(id);
  if (!session) {
    location.hash = '#/record';
    return;
  }
  const rec: RecordSession = session;

  const wrap = document.createElement('div');
  wrap.className = 'play-page';

  const topbar = document.createElement('div');
  topbar.className = 'editor-topbar play-topbar';
  topbar.innerHTML = `
    <a class="btn small" href="#/record">← 返回</a>
    <input class="name-input" type="text" value="${rec.name}" data-name placeholder="录制名称" />
    <button class="btn small primary" data-save>💾 保存</button>
    <span class="muted">场景：</span>
    <select class="scene-select" data-scene></select>
    <span class="play-state"></span>
  `;
  wrap.appendChild(topbar);

  const layout = document.createElement('div');
  layout.className = 'editor-layout play-layout';

  const left = document.createElement('div');
  left.className = 'panel play-list';
  const center = document.createElement('div');
  center.className = 'panel viewport-panel';
  const right = document.createElement('div');
  right.className = 'panel inspector';

  layout.append(left, center, right);
  wrap.appendChild(layout);
  root.appendChild(wrap);

  // ---- Center: toolbar + viewport + overlays ----
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar play-toolbar';
  toolbar.innerHTML = `
    <button class="btn small danger" data-record>● 录制选中元件</button>
    <button class="btn small" data-record-cam>🎥 录制相机</button>
    <button class="btn small" data-playall>▶ 播放全部</button>
    <button class="btn small" data-save-anim>💾 保存为动画</button>
    <button class="btn small" data-video>🎥 导出视频</button>
    <button class="btn small icon" data-info title="说明">ℹ️</button>
  `;
  center.appendChild(toolbar);

  const viewportHost = document.createElement('div');
  viewportHost.className = 'viewport-host';
  center.appendChild(viewportHost);

  // ---- Info popup (semi-transparent, opened via the ℹ️ button) ----
  const infoPanel = document.createElement('div');
  infoPanel.className = 'play-info';
  infoPanel.hidden = true;
  infoPanel.innerHTML = `
    <div class="play-info-card">
      <div class="info-title">🎬 扮演视频模式说明 Role-Play Video</div>
      <div class="info-body">
        <div class="info-group">
          <div class="info-h">模式 Mode（弹窗内切换）</div>
          <ul>
            <li><b>🦅 飞行</b>：自由 6 向移动；<b>空格</b> 上升 / <b>Shift</b> 下降。</li>
            <li><b>🚶 贴地</b>：自动贴合地形高度移动。</li>
            <li><b>速度</b>：弹窗内滑块调节移动速度。</li>
          </ul>
        </div>
        <div class="info-group">
          <div class="info-h">控制元件 Object</div>
          <ul>
            <li>在左侧或场景中选中一个元件（高亮）。</li>
            <li>点「● 录制：元件名」→ 选模式/速度确认 → 进入就位。</li>
            <li>用 <b>W/A/S/D</b> + 鼠标把元件移到想要的<b>起始位置与朝向</b>。</li>
            <li>按 <b>回车 Enter</b> 开始录制；按 <b>Esc</b> 结束并形成一条轨道。</li>
            <li>继续录制其它元件，录制时之前的轨道会<b>按时间对齐</b>一起重放。</li>
          </ul>
        </div>
        <div class="info-group">
          <div class="info-h">控制相机 Camera（导出视频用）</div>
          <ul>
            <li>点「🎥 录制相机」→ 选模式/速度确认 → 进入就位。</li>
            <li>用 <b>W/A/S/D</b> + 鼠标移动到想要的<b>起始视角</b>。</li>
            <li>按 <b>回车 Enter</b> 开始，形成特殊的<b>相机轨道</b>。</li>
            <li>有了相机轨道，「🎥 导出视频」即可沿相机路径运镜导出。</li>
          </ul>
        </div>
      </div>
      <button class="btn small" data-info-close>关闭</button>
    </div>
  `;
  center.appendChild(infoPanel);

  // ---- Recording indicator (DOM only) ----
  const recDot = document.createElement('div');
  recDot.className = 'play-rec';
  recDot.innerHTML = `<span class="dot"></span><span class="rec-time">REC 00:00</span>`;
  recDot.hidden = true;
  center.appendChild(recDot);

  // ---- Arming panel (bottom, semi-transparent): position then Enter ----
  const armPanel = document.createElement('div');
  armPanel.className = 'play-arm';
  armPanel.hidden = true;
  armPanel.innerHTML = `
    <div class="arm-icon">🎮</div>
    <div class="arm-text">
      <b class="arm-title"></b>
      <span class="arm-sub">用 <b>W/A/S/D</b> + 鼠标移动到想要的<b>起始位置与朝向</b>，按 <b>回车 Enter</b> 开始录制，按 <b>Esc</b> 退出。</span>
    </div>
  `;
  center.appendChild(armPanel);

  // ---- Record modal (semi-transparent, non-blocking) ----
  const modal = document.createElement('div');
  modal.className = 'play-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="play-modal-card">
      <div class="modal-title">🎥 开始录制 Begin Recording</div>
      <p class="muted">即将进入扮演与录制。请选择控制模式：</p>
      <div class="modal-modes">
        <button class="btn mode active" data-m="fly">🦅 飞行模式 Fly<small>自由 6 向飞行（空格上升 / Shift 下降）</small></button>
        <button class="btn mode" data-m="ground">🚶 贴地模式 Ground<small>贴合地形移动，自动贴地</small></button>
      </div>
      <label class="field inline modal-speed">速度 Speed
        <input type="range" min="1" max="40" step="1" value="5" data-mspeed />
        <span data-mspeed-v>5</span>
      </label>
      <p class="modal-tip">操作：<b>W/A/S/D</b> 前后左右移动，<b>鼠标</b> 转向，<b>Esc</b> 结束录制并形成轨道。</p>
      <div class="modal-actions">
        <button class="btn small" data-cancel>取消</button>
        <button class="btn small primary" data-confirm>进入录制</button>
      </div>
    </div>
  `;
  center.appendChild(modal);

  let assets: AssetComponent[] = [];
  let currentScene: SceneComponent | null = null;
  let recStart = 0;
  let recTimer = 0;

  const viewport = new PlayViewport(viewportHost, {
    onRecordingChange: (rec, objId) => {
      center.classList.toggle('play-recording', rec);
      recDot.hidden = !rec;
      const btn = toolbar.querySelector('[data-record]') as HTMLButtonElement;
      if (rec) {
        btn.textContent = '■ 停止 Stop';
        btn.classList.add('active');
        recStart = Date.now();
        recTimer = window.setInterval(updateRecTime, 500);
        updateRecTime();
      } else {
        btn.classList.remove('active');
        window.clearInterval(recTimer);
        renderTracks();
        refreshControls();
      }
      void objId;
    },
    onCameraRecordingChange: (rec) => {
      center.classList.toggle('play-recording', rec);
      recDot.hidden = !rec;
      const btn = toolbar.querySelector('[data-record-cam]') as HTMLButtonElement;
      if (rec) {
        btn.textContent = '■ 停止相机';
        btn.classList.add('active');
        recStart = Date.now();
        recTimer = window.setInterval(updateRecTime, 500);
        updateRecTime();
        refreshControls();
      } else {
        btn.textContent = '🎥 录制相机';
        btn.classList.remove('active');
        window.clearInterval(recTimer);
        renderTracks();
        refreshControls();
      }
    },
    onArmingChange: (kind) => {
      if (kind) {
        armPanel.hidden = false;
        (armPanel.querySelector('.arm-title') as HTMLElement).textContent =
          kind === 'camera' ? '🎥 相机就位中（移动到起始视角）' : '🎬 元件就位中（移动到起始位置）';
      } else {
        armPanel.hidden = true;
      }
    },
    onSelect: (id) => {
      renderObjectList(id);
      refreshControls();
    },
    onTracksChange: () => {
      renderObjectList(viewport.getSelectedId());
      renderTracks();
      refreshControls();
    },
    onPlayAllChange: (p) => {
      center.classList.toggle('play-playing', p);
      const btn = toolbar.querySelector('[data-playall]') as HTMLButtonElement;
      btn.textContent = p ? '■ 停止' : '▶ 播放全部';
      btn.classList.toggle('active', p);
    },
    onVideoChange: (v) => {
      const btn = toolbar.querySelector('[data-video]') as HTMLButtonElement;
      btn.textContent = v ? '■ 停止视频' : '🎥 导出视频';
      btn.classList.toggle('active', v);
    },
  });

  (root as HTMLElement & { __dispose?: () => void }).__dispose = () => {
    try {
      viewport.dispose();
    } catch {
      /* already torn down */
    }
  };

  function updateRecTime() {
    const s = Math.floor((Date.now() - recStart) / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    (recDot.querySelector('.rec-time') as HTMLElement).textContent = `REC ${mm}:${ss}`;
  }

  const setState = (t: string) => {
    (topbar.querySelector('.play-state') as HTMLElement).textContent = t;
  };

  // ---- Enable/disable controls based on scene + selection + tracks ----
  function refreshControls() {
    const hasScene = !!currentScene;
    const selId = viewport.getSelectedId();
    const sel = topbar.querySelector('[data-scene]') as HTMLSelectElement;
    sel.classList.toggle('highlight', !hasScene);

    const recBtn = toolbar.querySelector('[data-record]') as HTMLButtonElement;
    const canRec = hasScene && !!selId;
    recBtn.disabled = !canRec;
    if (canRec) {
      const obj = currentScene!.objects.find((o) => o.id === selId);
      recBtn.textContent = `● 录制：${obj?.name ?? '元件'}`;
      recBtn.title = '';
    } else {
      recBtn.textContent = '● 录制选中元件';
      recBtn.title = !hasScene ? '请先选择场景' : '请先选中一个元件';
    }

    const camBtn = toolbar.querySelector('[data-record-cam]') as HTMLButtonElement;
    camBtn.disabled = !hasScene;
    const playBtn = toolbar.querySelector('[data-playall]') as HTMLButtonElement;
    playBtn.disabled = !hasScene || !viewport.hasTracks();
    const saveAnimBtn = toolbar.querySelector('[data-save-anim]') as HTMLButtonElement;
    saveAnimBtn.disabled = !hasScene || !viewport.hasTracks();
    const videoBtn = toolbar.querySelector('[data-video]') as HTMLButtonElement;
    videoBtn.disabled = !hasScene || !viewport.hasCameraTrack();
    const topSave = topbar.querySelector('[data-save]') as HTMLButtonElement;
    topSave.disabled = !hasScene;
  }

  // ---- Left panel ----
  function renderLeft() {
    left.innerHTML = '<h4>元件库 Assets</h4><div class="asset-place"></div><h4>场景物件 Objects</h4><div class="obj-items"></div>';
    const place = left.querySelector('.asset-place') as HTMLElement;
    place.innerHTML = `
      <select class="asset-select" data-asset><option value="">选择元件…</option>${assets
        .map((a) => `<option value="${a.id}">${a.name} · ${a.category}</option>`)
        .join('')}</select>
      <button class="btn small primary full" data-place>放置（点击地形）</button>
      <p class="muted tiny">选中场景中已有元件后，可点击「录制」开始扮演录制。</p>
    `;
    const sel = place.querySelector('[data-asset]') as HTMLSelectElement;
    sel.addEventListener('change', () => viewport.armPlacement(sel.value || null));
    place.querySelector('[data-place]')!.addEventListener('click', () => {
      if (sel.value) viewport.armPlacement(sel.value);
    });
  }

  function renderObjectList(selectedId: string | null = null) {
    const host = left.querySelector('.obj-items') as HTMLElement;
    if (!currentScene) {
      host.innerHTML = '<p class="muted tiny">请先在顶部选择场景。</p>';
      return;
    }
    host.innerHTML = '';
    currentScene.objects.forEach((o) => {
      const item = document.createElement('div');
      item.className = 'obj-item' + (o.id === selectedId ? ' active' : '');
      const hasTrack = viewport.getTrackSummary().some((t) => t.objectId === o.id);
      item.innerHTML = `<span class="oname">${o.name}</span>${hasTrack ? '<span class="track-dot" title="已录制轨道"></span>' : ''}`;
      item.addEventListener('click', () => {
        viewport.setSelected(o.id);
        renderObjectList(o.id);
        refreshControls();
      });
      host.appendChild(item);
    });
  }

  // ---- Right panel: tracks ----
  function renderTracks() {
    right.innerHTML = '<h4>轨道 Tracks</h4><div class="track-list"></div>';
    const host = right.querySelector('.track-list') as HTMLElement;
    const tracks = viewport.getTrackSummary();
    if (tracks.length === 0 && !viewport.hasCameraTrack()) {
      host.innerHTML = '<p class="muted">还没有轨道。选中一个元件并录制，将形成第一条轨道；或用「🎥 录制相机」形成相机轨道以导出视频。</p>';
      return;
    }
    if (viewport.hasCameraTrack()) {
      const dur = viewport.getDuration();
      const mm = String(Math.floor(dur / 60)).padStart(2, '0');
      const ss = String(Math.floor(dur % 60)).padStart(2, '0');
      const row = document.createElement('div');
      row.className = 'track-row camera';
      row.innerHTML = `
        <span class="tname">🎥 相机轨道 Camera</span>
        <span class="tmeta">可导出视频 · ${mm}:${ss}</span>
      `;
      host.appendChild(row);
    }
    tracks.forEach((t) => {
      const row = document.createElement('div');
      row.className = 'track-row';
      const mm = String(Math.floor(t.duration / 60)).padStart(2, '0');
      const ss = String(Math.floor(t.duration % 60)).padStart(2, '0');
      row.innerHTML = `
        <span class="tname">${t.name}</span>
        <span class="tmeta">${t.samples} 采样 · ${mm}:${ss}</span>
      `;
      host.appendChild(row);
    });
    const note = document.createElement('p');
    note.className = 'muted tiny';
    note.textContent = '录制其它元件时，以上轨道会按时间对齐一起重放；有相机轨道时播放/导出将沿相机路径运镜。';
    right.appendChild(note);
  }

  // ---- Scene loading ----
  async function loadScene(sid: string, loadTracksFromSession: boolean) {
    const scene = await getScene(sid);
    if (!scene) {
      setState('场景不存在');
      return;
    }
    currentScene = scene;
    await viewport.setScene(scene, assets);
    // Switching scene invalidates any previous tracks.
    rec.tracks = [];
    rec.cameraTrack = null;
    if (loadTracksFromSession && rec.sceneId === sid) {
      viewport.loadTracks(rec.tracks, rec.cameraTrack);
    }
    if (!(topbar.querySelector('[data-name]') as HTMLInputElement).value.trim()) {
      (topbar.querySelector('[data-name]') as HTMLInputElement).value = scene.name + ' 扮演动画';
    }
    renderObjectList();
    renderTracks();
    refreshControls();
    setState(`已载入：${scene.name}`);
  }

  async function renderSceneSelect() {
    const scenes = await listScenes();
    const sel = topbar.querySelector('[data-scene]') as HTMLSelectElement;
    sel.innerHTML =
      '<option value="">— 请选择场景 —</option>' +
      scenes.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
    if (rec.sceneId) sel.value = rec.sceneId;
    sel.addEventListener('change', () => {
      if (sel.value) void loadScene(sel.value, false);
    });
  }

  async function saveSession() {
    if (!currentScene) {
      setState('请先选择场景');
      return;
    }
    const data = viewport.getTracksData();
    const name = ((topbar.querySelector('[data-name]') as HTMLInputElement).value || '未命名录制').slice(0, 60);
    rec.name = name;
    rec.sceneId = currentScene.id;
    rec.tracks = data.tracks;
    rec.cameraTrack = data.cameraTrack;
    rec.thumbnail = viewport.captureThumbnail();
    try {
      await updateRecord(rec.id, {
        name: rec.name,
        sceneId: rec.sceneId,
        tracks: rec.tracks,
        cameraTrack: rec.cameraTrack,
        thumbnail: rec.thumbnail,
      });
      setState('已保存 ✓');
    } catch (err) {
      setState('保存失败：' + (err as Error).message);
    }
  }

  // ---- Toolbar interactions ----
  toolbar.querySelector('[data-record]')!.addEventListener('click', () => {
    if (viewport.isRecording()) {
      viewport.stopRecording();
      return;
    }
    if (viewport.isCameraRecording()) {
      viewport.stopCameraRecording();
      return;
    }
    if (viewport.getSelectedId()) openModal('object');
  });

  toolbar.querySelector('[data-record-cam]')!.addEventListener('click', () => {
    if (viewport.isCameraRecording()) {
      viewport.stopCameraRecording();
      return;
    }
    if (viewport.isRecording()) {
      viewport.stopRecording();
      return;
    }
    openModal('camera');
  });

  toolbar.querySelector('[data-playall]')!.addEventListener('click', () => {
    if (viewport.isPlayingAll()) viewport.stopPlayAll();
    else viewport.playAll();
  });

  toolbar.querySelector('[data-save-anim]')!.addEventListener('click', async () => {
    if (!currentScene || !viewport.hasTracks()) {
      setState('请先录制轨道');
      return;
    }
    const name = ((topbar.querySelector('[data-name]') as HTMLInputElement).value || '扮演动画').slice(0, 60);
    const anim = viewport.buildAnimation(name, currentScene.id);
    if (!anim) {
      setState('生成动画失败');
      return;
    }
    try {
      await createAnimation({
        name: anim.name,
        sceneId: anim.sceneId,
        duration: anim.duration,
        tracks: anim.tracks,
        thumbnail: viewport.captureThumbnail(),
      });
      setState('已保存为动画 ✓（见「动画」页）');
    } catch (err) {
      setState('保存失败：' + (err as Error).message);
    }
  });

  toolbar.querySelector('[data-video]')!.addEventListener('click', () => {
    if (viewport.isPlayingAll()) viewport.stopVideoRecord();
    else if (viewport.hasCameraTrack()) void viewport.startVideoRecord();
  });

  // ---- Modal ----
  let pendingMode: PlayModeType = 'fly';
  let modalTarget: 'object' | 'camera' = 'object';
  function openModal(target: 'object' | 'camera') {
    modalTarget = target;
    modal.hidden = false;
    pendingMode = viewport.getMode();
    (modal.querySelector('.modal-title') as HTMLElement).textContent =
      target === 'camera' ? '🎥 开始录制相机 Begin Camera Take' : '🎥 开始录制 Begin Recording';
    (modal.querySelector('.modal-tip') as HTMLElement).innerHTML =
      target === 'camera'
        ? '确认后进入就位：用 <b>W/A/S/D</b> + 鼠标移动到起始视角，按 <b>回车 Enter</b> 开始录制相机轨道（有了相机轨道即可导出视频），<b>Esc</b> 退出。'
        : '确认后进入就位：用 <b>W/A/S/D</b> + 鼠标移动到起始位置与朝向，按 <b>回车 Enter</b> 开始录制，<b>Esc</b> 退出。';
    modal.querySelectorAll('[data-m]').forEach((b) =>
      b.classList.toggle('active', (b as HTMLElement).getAttribute('data-m') === pendingMode),
    );
    const mspeed = modal.querySelector('[data-mspeed]') as HTMLInputElement;
    const mspeedV = modal.querySelector('[data-mspeed-v]') as HTMLElement;
    const sp = Math.round(viewport.getSpeed());
    mspeed.value = String(sp);
    mspeedV.textContent = String(sp);
    mspeed.oninput = () => {
      mspeedV.textContent = mspeed.value;
      viewport.setSpeed(parseFloat(mspeed.value));
    };
  }
  function closeModal() {
    modal.hidden = true;
  }
  modal.querySelectorAll('[data-m]').forEach((b) =>
    b.addEventListener('click', () => {
      pendingMode = (b as HTMLElement).getAttribute('data-m') as PlayModeType;
      modal.querySelectorAll('[data-m]').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
    }),
  );
  modal.querySelector('[data-cancel]')!.addEventListener('click', closeModal);
  modal.querySelector('[data-confirm]')!.addEventListener('click', async () => {
    closeModal();
    viewport.setMode(pendingMode);
    if (modalTarget === 'camera') await viewport.startCameraRecording(pendingMode);
    else await viewport.startRecording(pendingMode);
  });

  // ---- Info popup (ℹ️ button) ----
  toolbar.querySelector('[data-info]')!.addEventListener('click', () => {
    infoPanel.hidden = !infoPanel.hidden;
  });
  infoPanel.querySelector('[data-info-close]')!.addEventListener('click', () => {
    infoPanel.hidden = true;
  });

  // ---- Top bar save ----
  topbar.querySelector('[data-save]')!.addEventListener('click', () => void saveSession());

  // ---- Init ----
  assets = await listAssets();
  renderLeft();
  await renderSceneSelect();
  if (rec.sceneId) {
    await loadScene(rec.sceneId, true);
  } else {
    renderObjectList();
    renderTracks();
    refreshControls();
    setState('请选择场景后开始录制');
  }
}
