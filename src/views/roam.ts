import { type AssetComponent } from '../schema';
import { RoamViewport, type RoamMode } from '../lib/roam-view.ts';
import { listScenes, getScene } from '../lib/scene-api.ts';
import { listAssets } from '../lib/api.ts';

export async function renderRoam(root: HTMLElement, id?: string) {
  const wrap = document.createElement('div');
  wrap.className = 'roam-page';

  const topbar = document.createElement('div');
  topbar.className = 'editor-topbar roam-topbar';
  topbar.innerHTML = `
    <a class="btn small" href="#/scenes">← 场景</a>
    <span class="muted">选择场景：</span>
    <select class="scene-select" data-scene></select>
    <span class="roam-state"></span>
  `;
  wrap.appendChild(topbar);

  const stage = document.createElement('div');
  stage.className = 'roam-stage';
  wrap.appendChild(stage);

  const viewportHost = document.createElement('div');
  viewportHost.className = 'viewport-host roam-host';
  stage.appendChild(viewportHost);

  // ---- Instructions overlay (hidden while recording) ----
  const help = document.createElement('div');
  help.className = 'roam-help';
  help.innerHTML = `
    <div class="roam-help-title">🎮 漫游操作 Roam Controls</div>
    <ul>
      <li>点击画面进入漫游（锁定鼠标）</li>
      <li><b>W/A/S/D</b> 前后左右移动</li>
      <li><b>鼠标</b> 转动视角</li>
      <li><b>空格 / Shift</b> 上升 / 下降（飞行模式）</li>
      <li><b>Esc</b> 释放鼠标</li>
    </ul>
    <button class="btn small" data-help-close>知道了</button>
  `;
  stage.appendChild(help);

  // ---- Bottom control bar (hidden while recording) ----
  const bar = document.createElement('div');
  bar.className = 'roam-bar';
  bar.innerHTML = `
    <div class="roam-mode">
      <button class="btn small mode" data-mode="walk">🚶 行走 Walk</button>
      <button class="btn small mode active" data-mode="fly">🦅 飞行 Fly</button>
    </div>
    <label class="roam-speed">
      速度 Speed
      <input type="range" min="1" max="40" step="1" value="5" data-speed />
      <span data-speed-v>5</span>
    </label>
    <button class="btn small danger" data-record>● 录制 Record</button>
  `;
  stage.appendChild(bar);

  // ---- Recording indicator (DOM only; never in the canvas video) ----
  const recDot = document.createElement('div');
  recDot.className = 'roam-rec';
  recDot.innerHTML = `<span class="dot"></span><span class="rec-time">REC 00:00</span>`;
  recDot.hidden = true;
  stage.appendChild(recDot);

  root.appendChild(wrap);

  let assets: AssetComponent[] = [];
  let currentId: string | undefined = id;
  let recStart = 0;
  let recTimer = 0;

  const viewport = new RoamViewport(viewportHost, {
    onRecordingChange: (rec) => {
      stage.classList.toggle('roam-recording', rec);
      recDot.hidden = !rec;
      const btn = bar.querySelector('[data-record]') as HTMLButtonElement;
      if (rec) {
        btn.textContent = '■ 停止 Stop';
        btn.classList.add('active');
        recStart = Date.now();
        recTimer = window.setInterval(updateRecTime, 500);
        updateRecTime();
      } else {
        btn.textContent = '● 录制 Record';
        btn.classList.remove('active');
        window.clearInterval(recTimer);
      }
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
    (topbar.querySelector('.roam-state') as HTMLElement).textContent = t;
  };

  async function loadScene(sid: string) {
    const scene = await getScene(sid);
    if (!scene) {
      setState('场景不存在');
      return;
    }
    await viewport.setScene(scene, assets);
    currentId = sid;
    setState(`已载入：${scene.name}`);
  }

  // ---- Scene selector ----
  async function renderSceneSelect() {
    const scenes = await listScenes();
    const sel = topbar.querySelector('[data-scene]') as HTMLSelectElement;
    sel.innerHTML =
      '<option value="">— 请选择场景 —</option>' +
      scenes.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
    if (currentId) sel.value = currentId;
    sel.addEventListener('change', () => {
      if (sel.value) void loadScene(sel.value);
    });
  }

  // ---- Bottom bar interactions ----
  bar.querySelectorAll('[data-mode]').forEach((b) =>
    b.addEventListener('click', () => {
      const mode = (b as HTMLElement).getAttribute('data-mode') as RoamMode;
      viewport.setMode(mode);
      bar.querySelectorAll('[data-mode]').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
    }),
  );
  const speed = bar.querySelector('[data-speed]') as HTMLInputElement;
  const speedV = bar.querySelector('[data-speed-v]') as HTMLElement;
  speed.addEventListener('input', () => {
    speedV.textContent = speed.value;
    viewport.setSpeed(parseFloat(speed.value));
  });
  bar.querySelector('[data-record]')!.addEventListener('click', async () => {
    if (viewport.isRecording()) {
      viewport.stopRecording();
    } else {
      await viewport.startRecording();
    }
  });

  help.querySelector('[data-help-close]')!.addEventListener('click', () => {
    help.hidden = true;
  });

  // ---- Init ----
  assets = await listAssets();
  await renderSceneSelect();
  if (currentId) {
    await loadScene(currentId);
  } else {
    setState('请选择一个场景开始漫游');
  }
}
