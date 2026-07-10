import { useEffect, useState } from 'react';
import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { RoamViewport, type RoamMode } from '../../lib/roam-view';
import { listScenes, getScene } from '../../lib/scene-api';
import { listAssets } from '../../lib/api';
import type { AssetComponent, SceneComponent } from '../../schema';

const BTN_SM =
  'inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent';
const BTN_SM_ACTIVE =
  BTN_SM + ' bg-accent border-accent text-[#06140a] font-semibold';
const BTN_SM_DANGER =
  'inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2.5 py-1.5 text-[13px] text-danger transition-colors hover:border-danger';

export function RoamView({ id }: { id?: string }) {
  const [scenes, setScenes] = useState<SceneComponent[]>([]);
  const [assets, setAssets] = useState<AssetComponent[]>([]);
  const [currentId, setCurrentId] = useState<string | undefined>(id);
  const [ready, setReady] = useState(false);
  const [stateText, setStateText] = useState('请选择一个场景开始漫游');
  const [mode, setMode] = useState<RoamMode>('fly');
  const [speed, setSpeed] = useState(5);
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState('REC 00:00');
  const [helpOpen, setHelpOpen] = useState(true);

  const { ref, instance } = useCanvasView(
    (host) => {
      const vp = new RoamViewport(host, {
        onRecordingChange: (rec) => {
          setRecording(rec);
          if (!rec) setRecTime('REC 00:00');
        },
      });
      setReady(true);
      return vp;
    },
    id,
  );

  useEffect(() => {
    void (async () => {
      const [sc, a] = await Promise.all([listScenes(), listAssets()]);
      setScenes(sc);
      setAssets(a);
    })();
  }, []);

  useEffect(() => {
    if (!ready || !currentId || !instance.current) return;
    void (async () => {
      const scene = await getScene(currentId);
      if (!scene) {
        setStateText('场景不存在');
        return;
      }
      await instance.current!.setScene(scene, assets);
      setStateText(`已载入：${scene.name}`);
    })();
  }, [ready, currentId, assets, instance]);

  useEffect(() => {
    if (!recording) return;
    const start = Date.now();
    const t = window.setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      setRecTime(`REC ${mm}:${ss}`);
    }, 500);
    return () => window.clearInterval(t);
  }, [recording]);

  const handleMode = (m: RoamMode) => {
    instance.current?.setMode(m);
    setMode(m);
  };
  const handleSpeed = (v: number) => {
    instance.current?.setSpeed(v);
    setSpeed(v);
  };
  const toggleRecord = async () => {
    if (instance.current?.isRecording()) await instance.current.stopRecording();
    else await instance.current?.startRecording();
  };

  return (
    <PageShell active="roam">
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border bg-panel px-5 py-2.5">
          <a className={BTN_SM} href="#/scenes">
            ← 场景
          </a>
          <span className="text-sm text-muted">选择场景：</span>
          <select
            className="min-w-[220px] rounded-lg border border-border bg-panel-2 px-2.5 py-1.5 text-sm text-text"
            value={currentId ?? ''}
            onChange={(e) => setCurrentId(e.target.value || undefined)}
          >
            <option value="">— 请选择场景 —</option>
            {scenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <span className="ml-auto text-sm text-accent">{stateText}</span>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            ref={ref}
            className="absolute inset-0 h-full w-full [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
          />

          {helpOpen && !recording && (
            <div className="absolute left-4 top-4 z-[6] max-w-[280px] rounded-[10px] border border-border bg-[rgba(20,22,28,0.82)] p-3.5 text-sm leading-relaxed shadow-panel [&_b]:font-semibold [&_b]:text-text">
              <div className="mb-2 font-semibold">🎮 漫游操作 Roam Controls</div>
              <ul className="mb-2.5 list-disc space-y-1 pl-4 text-muted">
                <li>点击画面进入漫游（锁定鼠标）</li>
                <li>
                  <b>W/A/S/D</b> 前后左右移动
                </li>
                <li>
                  <b>鼠标</b> 转动视角
                </li>
                <li>
                  <b>空格 / Shift</b> 上升 / 下降（飞行模式）
                </li>
                <li>
                  <b>Esc</b> 释放鼠标
                </li>
              </ul>
              <button className={BTN_SM} onClick={() => setHelpOpen(false)}>
                知道了
              </button>
            </div>
          )}

          {!recording && (
            <div className="absolute bottom-[18px] left-1/2 z-[6] flex max-w-[calc(100%-32px)] flex-wrap items-center justify-center gap-4 rounded-xl border border-border bg-[rgba(20,22,28,0.82)] px-4 py-2.5 shadow-panel">
              <div className="flex gap-2">
                <button className={mode === 'walk' ? BTN_SM_ACTIVE : BTN_SM} onClick={() => handleMode('walk')}>
                  🚶 行走 Walk
                </button>
                <button className={mode === 'fly' ? BTN_SM_ACTIVE : BTN_SM} onClick={() => handleMode('fly')}>
                  🦅 飞行 Fly
                </button>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted">
                速度 Speed
                <input
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={speed}
                  onChange={(e) => handleSpeed(parseInt(e.target.value, 10))}
                  className="w-[140px] accent-accent"
                />
                <span className="min-w-[20px] tabular-nums text-text">{speed}</span>
              </label>
              <button className={BTN_SM_DANGER} onClick={() => void toggleRecord()}>
                ● 录制 Record
              </button>
            </div>
          )}

          {recording && (
            <div className="absolute right-4 top-4 z-[7] inline-flex items-center gap-2 rounded-full border border-danger bg-[rgba(20,22,28,0.82)] px-3 py-1.5 text-sm tabular-nums text-[#ff8a80]">
              <span className="h-2.5 w-2.5 animate-roam-blink rounded-full bg-danger" />
              <span>{recTime}</span>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
