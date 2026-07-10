import { useCallback, useEffect, useState } from 'react';
import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { PlayViewport, type PlayMode } from '../../lib/play-view';
import { listScenes, getScene } from '../../lib/scene-api';
import { listAssets } from '../../lib/api';
import { createAnimation } from '../../lib/anim-api';
import { getRecord, updateRecord } from '../../lib/record-api';
import type { AssetComponent, SceneComponent } from '../../schema';

const BTN_SM =
  'inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-50';
const BTN_SM_ACTIVE = BTN_SM + ' bg-accent border-accent text-[#06140a] font-semibold';
const BTN_SM_PRIMARY =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-[#06140a] transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-50';

export function PlayView({ id }: { id?: string }) {
  const [assets, setAssets] = useState<AssetComponent[]>([]);
  const [scenes, setScenes] = useState<SceneComponent[]>([]);
  const [currentScene, setCurrentScene] = useState<SceneComponent | null>(null);
  const [sceneId, setSceneId] = useState<string | undefined>(id ? undefined : undefined);
  const [recName, setRecName] = useState('');
  const [playState, setPlayState] = useState('请选择场景后开始录制');
  const [recording, setRecording] = useState(false);
  const [cameraRecording, setCameraRecording] = useState(false);
  const [playingAll, setPlayingAll] = useState(false);
  const [videoRecording, setVideoRecording] = useState(false);
  const [arming, setArming] = useState<'' | 'object' | 'camera'>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [armedAsset, setArmedAsset] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<'object' | 'camera'>('object');
  const [pendingMode, setPendingMode] = useState<PlayMode>('fly');
  const [modalSpeed, setModalSpeed] = useState(5);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  const { ref, instance } = useCanvasView(
    (host) => {
      const vp = new PlayViewport(host, {
        onRecordingChange: (rec, objId) => {
          setRecording(rec);
          void objId;
          if (!rec) {
            refresh();
          }
        },
        onCameraRecordingChange: (rec) => {
          setCameraRecording(rec);
          if (!rec) refresh();
        },
        onArmingChange: (kind) => setArming(kind ?? ''),
        onSelect: (oid) => {
          setSelectedId(oid);
          refresh();
        },
        onTracksChange: () => refresh(),
        onPlayAllChange: (p) => setPlayingAll(p),
        onVideoChange: (v) => setVideoRecording(v),
      });
      return vp;
    },
    id,
  );

  const vp = () => instance.current;

  useEffect(() => {
    void (async () => {
      const [a, sc] = await Promise.all([listAssets(), listScenes()]);
      setAssets(a);
      setScenes(sc);
    })();
  }, []);

  const loadScene = useCallback(
    async (sid: string, loadTracks: boolean) => {
      const scene = await getScene(sid);
      if (!scene) {
        setPlayState('场景不存在');
        return;
      }
      setCurrentScene(scene);
      setSceneId(sid);
      await vp()?.setScene(scene, assets);
      if (loadTracks) vp()?.loadTracks([], null);
      if (!recName.trim()) setRecName(scene.name + ' 扮演动画');
      refresh();
      setPlayState(`已载入：${scene.name}`);
    },
    [assets, recName, refresh],
  );

  useEffect(() => {
    if (!id) {
      location.hash = '#/record';
      return;
    }
    void (async () => {
      const session = await getRecord(id);
      if (!session) {
        location.hash = '#/record';
        return;
      }
      setRecName(session.name);
      if (session.sceneId) await loadScene(session.sceneId, true);
      else {
        setPlayState('请选择场景后开始录制');
        refresh();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const hasTracks = vp()?.hasTracks() ?? false;
  const hasCameraTrack = vp()?.hasCameraTrack() ?? false;

  const openModal = (target: 'object' | 'camera') => {
    setModalTarget(target);
    setPendingMode(vp()?.getMode() ?? 'fly');
    setModalSpeed(Math.round(vp()?.getSpeed() ?? 5));
    setModalOpen(true);
  };
  const confirmModal = async () => {
    setModalOpen(false);
    vp()?.setMode(pendingMode);
    if (modalTarget === 'camera') await vp()?.startCameraRecording(pendingMode);
    else await vp()?.startRecording(pendingMode);
  };

  const toggleRecord = async () => {
    const v = vp();
    if (!v) return;
    if (v.isRecording()) {
      v.stopRecording();
      return;
    }
    if (v.isCameraRecording()) {
      v.stopCameraRecording();
      return;
    }
    if (v.getSelectedId()) openModal('object');
  };
  const toggleRecordCam = async () => {
    const v = vp();
    if (!v) return;
    if (v.isCameraRecording()) v.stopCameraRecording();
    else if (v.isRecording()) v.stopRecording();
    else openModal('camera');
  };
  const togglePlayAll = () => {
    const v = vp();
    if (!v) return;
    if (v.isPlayingAll()) v.stopPlayAll();
    else v.playAll();
  };
  const toggleVideo = () => {
    const v = vp();
    if (!v) return;
    if (v.isPlayingAll()) v.stopVideoRecord();
    else if (v.hasCameraTrack()) void v.startVideoRecord();
  };
  const saveAnim = async () => {
    const v = vp();
    if (!currentScene || !v?.hasTracks()) {
      setPlayState('请先录制轨道');
      return;
    }
    const anim = v.buildAnimation((recName || '扮演动画').slice(0, 60), currentScene.id);
    if (!anim) {
      setPlayState('生成动画失败');
      return;
    }
    try {
      await createAnimation({
        name: anim.name,
        sceneId: anim.sceneId,
        duration: anim.duration,
        tracks: anim.tracks,
        thumbnail: v.captureThumbnail(),
      });
      setPlayState('已保存为动画 ✓（见「动画」页）');
    } catch (err) {
      setPlayState('保存失败：' + (err as Error).message);
    }
  };
  const saveSession = async () => {
    const v = vp();
    if (!currentScene || !v) {
      setPlayState('请先选择场景');
      return;
    }
    const data = v.getTracksData();
    try {
      await updateRecord(id!, {
        name: (recName || '未命名录制').slice(0, 60),
        sceneId: currentScene.id,
        tracks: data.tracks,
        cameraTrack: data.cameraTrack,
        thumbnail: v.captureThumbnail(),
      });
      setPlayState('已保存 ✓');
    } catch (err) {
      setPlayState('保存失败：' + (err as Error).message);
    }
  };

  const trackSummary = vp()?.getTrackSummary() ?? [];
  const duration = vp()?.getDuration() ?? 0;
  const durStr = (d: number) => {
    const mm = String(Math.floor(d / 60)).padStart(2, '0');
    const ss = String(Math.floor(d % 60)).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <PageShell active="play">
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border bg-panel px-5 py-2.5">
          <a className={BTN_SM} href="#/record">
            ← 返回
          </a>
          <input
            className="min-w-[220px] rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
            type="text"
            value={recName}
            placeholder="录制名称"
            onChange={(e) => setRecName(e.target.value)}
          />
          <button className={BTN_SM_PRIMARY} onClick={() => void saveSession()}>
            💾 保存
          </button>
          <span className="text-sm text-muted">场景：</span>
          <select
            className={
              'min-w-[220px] rounded-lg border bg-bg px-2.5 py-1.5 text-sm text-text ' +
              (currentScene ? 'border-border' : 'border-accent bg-[rgba(120,200,120,0.12)] outline outline-2 outline-[rgba(120,200,120,0.45)]')
            }
            value={sceneId ?? ''}
            onChange={(e) => {
              if (e.target.value) void loadScene(e.target.value, false);
            }}
          >
            <option value="">— 请选择场景 —</option>
            {scenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <span className="ml-auto text-sm text-accent">{playState}</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[240px_1fr_320px]">
          {/* Left */}
          <aside className="flex flex-col overflow-auto border-r border-border bg-panel p-3">
            <h4 className="pb-2 text-[13px] uppercase tracking-[0.5px] text-muted">元件库 Assets</h4>
            <div className="asset-place flex flex-col gap-2">
              <select
                className="rounded-lg border border-border bg-panel-2 px-2 py-1 text-sm text-text"
                value={armedAsset}
                onChange={(e) => {
                  setArmedAsset(e.target.value);
                  vp()?.armPlacement(e.target.value || null);
                }}
              >
                <option value="">选择元件…</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} · {a.category}
                  </option>
                ))}
              </select>
              <button
                className={BTN_SM_PRIMARY + ' w-full justify-center'}
                onClick={() => vp()?.armPlacement(armedAsset || null)}
              >
                放置（点击地形）
              </button>
              <p className="text-[11px] text-muted">选中场景中已有元件后，可点击「录制」开始扮演录制。</p>
            </div>
            <h4 className="pb-2 pt-4 text-[13px] uppercase tracking-[0.5px] text-muted">场景物件 Objects</h4>
            <div className="flex flex-col gap-1.5" key={tick}>
              {!currentScene ? (
                <p className="text-[11px] text-muted">请先在顶部选择场景。</p>
              ) : (
                currentScene.objects.map((o) => (
                  <div
                    key={o.id}
                    className={
                      'flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-panel-2 px-2.5 py-2 ' +
                      (o.id === selectedId ? 'bg-accent text-[#06140a] font-semibold' : '')
                    }
                    onClick={() => {
                      vp()?.setSelected(o.id);
                      setSelectedId(o.id);
                      refresh();
                    }}
                  >
                    <span className="text-[13px]">{o.name}</span>
                    {trackSummary.some((t) => t.objectId === o.id) && (
                      <span className="h-2 w-2 rounded-full bg-accent" title="已录制轨道" />
                    )}
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Center */}
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <div className="flex flex-row flex-wrap items-center gap-2 border-b border-border bg-panel-2 px-3.5 py-2">
              <button
                className={recording ? BTN_SM_ACTIVE : BTN_SM}
                disabled={!currentScene || !selectedId}
                onClick={() => void toggleRecord()}
                title={!currentScene ? '请先选择场景' : !selectedId ? '请先选中一个元件' : ''}
              >
                {recording ? '■ 停止 Stop' : selectedId ? `● 录制：${currentScene?.objects.find((o) => o.id === selectedId)?.name ?? '元件'}` : '● 录制选中元件'}
              </button>
              <button
                className={cameraRecording ? BTN_SM_ACTIVE : BTN_SM}
                disabled={!currentScene}
                onClick={() => void toggleRecordCam()}
              >
                {cameraRecording ? '■ 停止相机' : '🎥 录制相机'}
              </button>
              <button
                className={playingAll ? BTN_SM_ACTIVE : BTN_SM}
                disabled={!currentScene || !hasTracks}
                onClick={togglePlayAll}
              >
                {playingAll ? '■ 停止' : '▶ 播放全部'}
              </button>
              <button
                className={BTN_SM}
                disabled={!currentScene || !hasTracks}
                onClick={() => void saveAnim()}
              >
                💾 保存为动画
              </button>
              <button
                className={videoRecording ? BTN_SM_ACTIVE : BTN_SM}
                disabled={!currentScene || !hasCameraTrack}
                onClick={toggleVideo}
              >
                {videoRecording ? '■ 停止视频' : '🎥 导出视频'}
              </button>
              <button
                className={BTN_SM}
                onClick={() => setInfoOpen((v) => !v)}
              >
                ℹ️
              </button>
            </div>

            <div
              ref={ref}
              className="relative min-h-0 flex-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
            />

            {(recording || cameraRecording) && (
              <div className="absolute right-3.5 top-3.5 z-[25] flex items-center gap-2 rounded-full border border-danger bg-[rgba(16,19,26,0.82)] px-3 py-1.5 text-sm tabular-nums text-white">
                <span className="h-2.5 w-2.5 animate-roam-blink rounded-full bg-danger" />
                <RecTimer active={recording || cameraRecording} />
              </div>
            )}

            {arming && !recording && !cameraRecording && (
              <div className="absolute bottom-[18px] left-1/2 z-[25] flex max-w-[min(680px,92%)] -translate-x-1/2 items-center gap-3 rounded-xl border border-border bg-[rgba(16,19,26,0.78)] px-4 py-3 text-white backdrop-blur-sm">
                <div className="text-[22px]">🎮</div>
                <div className="text-[13px] leading-relaxed">
                  <b className="block font-bold">
                    {arming === 'camera' ? '🎥 相机就位中（移动到起始视角）' : '🎬 元件就位中（移动到起始位置）'}
                  </b>
                  <span className="text-[#d7dbe3]">
                    用 <b>W/A/S/D</b> + 鼠标移动到想要的<b>起始位置与朝向</b>，按 <b>回车 Enter</b> 开始录制，按 <b>Esc</b> 退出。
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <aside className="flex min-h-0 flex-col overflow-hidden border-l border-border bg-panel">
            <h4 className="px-3.5 pb-2 pt-3.5 text-[13px] uppercase tracking-[0.5px] text-muted">
              轨道 Tracks
            </h4>
            <div className="min-h-0 flex-1 overflow-auto p-3" key={'t' + tick}>
              {trackSummary.length === 0 && !hasCameraTrack ? (
                <p className="text-sm text-muted">
                  还没有轨道。选中一个元件并录制，将形成第一条轨道；或用「🎥 录制相机」形成相机轨道以导出视频。
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {hasCameraTrack && (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-accent bg-[rgba(120,200,120,0.12)] px-3 py-2.5">
                      <span className="text-[13px] font-semibold text-accent">🎥 相机轨道 Camera</span>
                      <span className="text-[12px] text-muted tabular-nums">可导出视频 · {durStr(duration)}</span>
                    </div>
                  )}
                  {trackSummary.map((t) => (
                    <div
                      key={t.objectId}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border bg-panel-2 px-3 py-2.5"
                    >
                      <span className="text-[13px] font-semibold">{t.name}</span>
                      <span className="text-[12px] text-muted tabular-nums">
                        {t.samples} 采样 · {durStr(t.duration)}
                      </span>
                    </div>
                  ))}
                  <p className="text-[11px] text-muted">
                    录制其它元件时，以上轨道会按时间对齐一起重放；有相机轨道时播放/导出将沿相机路径运镜。
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Info popup */}
        <InfoPopup
          open={infoOpen}
          onClose={() => setInfoOpen(false)}
        />
        {/* Modal */}
        {modalOpen && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-transparent">
            <div className="w-[min(440px,92%)] rounded-[14px] border border-border bg-[rgba(16,19,26,0.86)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="text-[17px] font-bold">
                {modalTarget === 'camera' ? '🎥 开始录制相机 Begin Camera Take' : '🎥 开始录制 Begin Recording'}
              </div>
              <p className="mt-2 text-sm text-muted">即将进入扮演与录制。请选择控制模式：</p>
              <div className="mt-3 flex flex-col gap-2.5">
                <button
                  className={
                    'flex flex-col items-start gap-0.5 rounded-lg border border-border bg-panel-2 px-3.5 py-2.5 text-left ' +
                    (pendingMode === 'fly' ? 'border-accent bg-accent text-[#06140a]' : '')
                  }
                  onClick={() => setPendingMode('fly')}
                >
                  🦅 飞行模式 Fly
                  <small className="font-normal text-muted">自由 6 向飞行（空格上升 / Shift 下降）</small>
                </button>
                <button
                  className={
                    'flex flex-col items-start gap-0.5 rounded-lg border border-border bg-panel-2 px-3.5 py-2.5 text-left ' +
                    (pendingMode === 'ground' ? 'border-accent bg-accent text-[#06140a]' : '')
                  }
                  onClick={() => setPendingMode('ground')}
                >
                  🚶 贴地模式 Ground
                  <small className="font-normal text-muted">贴合地形移动，自动贴地</small>
                </button>
              </div>
              <label className="mt-3 flex items-center gap-2 text-xs text-muted">
                速度 Speed
                <input
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={modalSpeed}
                  onChange={(e) => {
                    setModalSpeed(parseInt(e.target.value, 10));
                    vp()?.setSpeed(parseInt(e.target.value, 10));
                  }}
                  className="w-[120px] accent-accent"
                />
                <span className="min-w-[20px] tabular-nums text-text">{modalSpeed}</span>
              </label>
              <p className="mt-3 text-[13px] text-muted">
                操作：<b>W/A/S/D</b> 前后左右移动，<b>鼠标</b> 转向，<b>Esc</b> 结束录制并形成轨道。
              </p>
              <div className="mt-4 flex justify-end gap-2.5">
                <button className={BTN_SM} onClick={() => setModalOpen(false)}>
                  取消
                </button>
                <button className={BTN_SM_PRIMARY} onClick={() => void confirmModal()}>
                  进入录制
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function RecTimer({ active }: { active: boolean }) {
  const [text, setText] = useState('REC 00:00');
  useEffect(() => {
    if (!active) {
      setText('REC 00:00');
      return;
    }
    const start = Date.now();
    const t = window.setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      setText(`REC ${mm}:${ss}`);
    }, 500);
    return () => window.clearInterval(t);
  }, [active]);
  return <span>{text}</span>;
}

function InfoPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="absolute left-3.5 top-3.5 right-3.5 z-20 max-w-[440px] rounded-xl border border-border bg-[rgba(16,19,26,0.92)] p-4 text-sm">
      <div className="mb-2 text-[16px] font-bold">🎬 扮演视频模式说明 Role-Play Video</div>
      <div className="mb-3">
        <div className="mb-1 font-semibold">模式 Mode（弹窗内切换）</div>
        <ul className="list-disc space-y-1 pl-4 text-muted">
          <li>
            <b>🦅 飞行</b>：自由 6 向移动；<b>空格</b> 上升 / <b>Shift</b> 下降。
          </li>
          <li>
            <b>🚶 贴地</b>：自动贴合地形高度移动。
          </li>
          <li>
            <b>速度</b>：弹窗内滑块调节移动速度。
          </li>
        </ul>
      </div>
      <div className="mb-3">
        <div className="mb-1 font-semibold">控制元件 Object</div>
        <ul className="list-disc space-y-1 pl-4 text-muted">
          <li>在左侧或场景中选中一个元件（高亮）。</li>
          <li>点「● 录制：元件名」→ 选模式/速度确认 → 进入就位。</li>
          <li>
            用 <b>W/A/S/D</b> + 鼠标把元件移到想要的<b>起始位置与朝向</b>。
          </li>
          <li>
            按 <b>回车 Enter</b> 开始录制；按 <b>Esc</b> 结束并形成一条轨道。
          </li>
          <li>继续录制其它元件，录制时之前的轨道会<b>按时间对齐</b>一起重放。</li>
        </ul>
      </div>
      <div className="mb-3">
        <div className="mb-1 font-semibold">控制相机 Camera（导出视频用）</div>
        <ul className="list-disc space-y-1 pl-4 text-muted">
          <li>点「🎥 录制相机」→ 选模式/速度确认 → 进入就位。</li>
          <li>
            用 <b>W/A/S/D</b> + 鼠标移动到想要的<b>起始视角</b>。
          </li>
          <li>
            按 <b>回车 Enter</b> 开始，形成特殊的<b>相机轨道</b>。
          </li>
          <li>有了相机轨道，「🎥 导出视频」即可沿相机路径运镜导出。</li>
        </ul>
      </div>
      <button className={BTN_SM} onClick={onClose}>
        关闭
      </button>
    </div>
  );
}
