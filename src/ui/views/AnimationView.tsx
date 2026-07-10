import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { AnimationViewport } from '../../lib/anim-view';
import {
  listScenes,
  getScene,
} from '../../lib/scene-api';
import {
  listAnimationsByScene,
  getAnimation,
  createAnimation,
  updateAnimation,
  deleteAnimation,
} from '../../lib/anim-api';
import { listAssets } from '../../lib/api';
import {
  createAnimationForScene,
  vec3,
  type AnimComponent,
  type AnimChannel,
  type AnimKf,
  type AnimState,
  type SceneComponent,
  type SceneObject,
  type AssetComponent,
} from '../../schema';
import { Vec3Field } from '../editor/fields';

const BTN_SM =
  'inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent';
const BTN_SM_ACTIVE = BTN_SM + ' bg-accent border-accent text-[#06140a] font-semibold';
const BTN_SM_PRIMARY =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-[#06140a] transition-colors hover:border-accent';
const BTN_SM_FULL = BTN_SM + ' w-full justify-center';

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

export function AnimationView({ id }: { id?: string }) {
  const animRef = useRef<AnimComponent | null>(null);
  const sceneRef = useRef<SceneComponent | null>(null);
  const assetsRef = useRef<AssetComponent[]>([]);
  const [, force] = useReducer((x: number) => x + 1, 0);
  const bump = useCallback(() => force(), []);

  const [scenes, setScenes] = useState<SceneComponent[]>([]);
  const [animItems, setAnimItems] = useState<{ id: string; name: string }[]>([]);
  const [ready, setReady] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>(id);
  const [name, setName] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [saveState, setSaveState] = useState('');
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  const vp = () => instance.current;

  const markDirty = (msg: string) => setSaveState(msg + '（未保存）');

  const { ref, instance } = useCanvasView((host) => {
    const v = new AnimationViewport(host);
    v.onTimeTick = (t) => setTime(t);
    setReady(true);
    return v;
  }, id);

  useEffect(() => {
    if (!ready) return;
    void (async () => {
      setScenes(await listScenes());
      const a = await listAssets();
      assetsRef.current = a;
    })();
  }, [ready]);

  const loadAnimationsForScene = useCallback(
    async (sid: string) => {
      const anims = await listAnimationsByScene(sid);
      setAnimItems(anims.map((a) => ({ id: a.id, name: a.name })));
      return anims;
    },
    [],
  );

  const selectScene = useCallback(
    async (sid: string) => {
      const s = await getScene(sid);
      if (!s) return;
      sceneRef.current = s;
      assetsRef.current = await listAssets();
      await vp()?.setScene(s, assetsRef.current);
      setName(s.name + ' 动画');
      setSavedId(undefined);
      setAnimRefNull();
      await loadAnimationsForScene(sid);
      bump();
    },
    [loadAnimationsForScene, bump],
  );

  const setAnimRefNull = () => {
    animRef.current = null;
    setSelectedTrackId(null);
  };

  const createNewAnimation = useCallback(
    async (sid: string) => {
      const s = sceneRef.current;
      if (!s) return;
      const anim = createAnimationForScene(sid, s.name, s.size);
      animRef.current = anim;
      setSavedId(undefined);
      setSelectedTrackId(null);
      setName(anim.name);
      vp()?.setAnimation(anim);
      await loadAnimationsForScene(sid);
      markDirty('已新建');
      bump();
    },
    [loadAnimationsForScene, bump],
  );

  const loadAnimation = useCallback(
    async (aid: string) => {
      const a = await getAnimation(aid);
      if (!a) return;
      if (!sceneRef.current || sceneRef.current.id !== a.sceneId) {
        const s = await getScene(a.sceneId);
        if (s) {
          sceneRef.current = s;
          assetsRef.current = await listAssets();
          await vp()?.setScene(s, assetsRef.current);
        }
      }
      animRef.current = a;
      setSavedId(aid);
      setSelectedTrackId(null);
      setName(a.name);
      vp()?.setAnimation(a);
      await loadAnimationsForScene(a.sceneId);
      setSaveState('');
      bump();
    },
    [loadAnimationsForScene, bump],
  );

  useEffect(() => {
    if (id) void loadAnimation(id);
    else bump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const next = !playing;
    setPlaying(next);
    vp()?.setPlaying(next);
    if (!next) {
      const t = selectedTrackId;
      if (t) vp()?.selectTrack(t);
    }
  };

  const onScrub = (v: number) => {
    setTime(v);
    vp()?.setTime(v);
  };
  const onSpeed = (v: number) => {
    setSpeed(v);
    vp()?.setSpeed(v);
  };
  const onDuration = (v: number) => {
    const a = animRef.current;
    if (!a) return;
    a.duration = Math.max(0.1, v);
    vp()?.refresh();
    markDirty('时长已调整');
    bump();
  };
  const recCamera = () => {
    vp()?.recordCamera();
    markDirty('已记录相机关键帧');
    bump();
  };
  const recObject = () => {
    if (selectedTrackId) {
      vp()?.recordSelectedObject();
      markDirty('已记录物件关键帧');
      bump();
    }
  };

  const boundObjectIds = (): Set<string> => {
    const set = new Set<string>();
    animRef.current?.tracks.forEach((t) => {
      if (t.kind === 'object' && t.objectId) set.add(t.objectId);
    });
    return set;
  };

  const addObjectTrack = (oid: string) => {
    const a = animRef.current;
    const scene = sceneRef.current;
    if (!a || !scene) return;
    const obj = scene.objects.find((o) => o.id === oid);
    if (!obj) return;
    const track: AnimChannel = {
      id: trackUid(),
      kind: 'object',
      objectId: oid,
      label: obj.name,
      keyframes: [{ time: 0, position: { ...obj.position }, rotation: { ...obj.rotation }, scale: { ...obj.scale } }],
    };
    a.tracks.push(track);
    setSelectedTrackId(track.id);
    vp()?.refresh();
    vp()?.selectTrack(track.id);
    markDirty('已添加轨道');
    bump();
  };

  const selectedTrack: AnimChannel | undefined = selectedTrackId
    ? animRef.current?.tracks.find((t) => t.id === selectedTrackId)
    : undefined;
  const selectedSceneObj: SceneObject | undefined =
    selectedTrack?.objectId ? sceneRef.current?.objects.find((o) => o.id === selectedTrack.objectId) : undefined;

  const currentKeyframe = (track: AnimChannel, create = false): AnimKf => {
    const t = vp()?.getTime() ?? 0;
    let kf = track.keyframes.find((k) => Math.abs(k.time - t) < 1e-3);
    if (!kf && create) {
      const obj = track.objectId ? sceneRef.current?.objects.find((o) => o.id === track.objectId) : undefined;
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
  };

  const writeKF = (
    track: AnimChannel,
    t: number,
    pos: { x: number; y: number; z: number },
    rot?: { x: number; y: number; z: number },
    scale?: { x: number; y: number; z: number },
  ) => {
    let kf = track.keyframes.find((k) => Math.abs(k.time - t) < 1e-3);
    if (!kf) {
      kf = { time: t, position: { ...pos }, rotation: rot ?? vec3(), scale: scale ?? vec3(1, 1, 1) };
      track.keyframes.push(kf);
      track.keyframes.sort((a, b) => a.time - b.time);
    }
    kf.position = { ...pos };
    if (rot) kf.rotation = { ...rot };
    if (scale) kf.scale = { ...scale };
    vp()?.refresh();
    markDirty('已调整关键帧');
  };

  const syncObj = (obj: SceneObject, track: AnimChannel) => {
    const kf = currentKeyframe(track);
    obj.position = { ...kf.position };
    obj.rotation = { ...kf.rotation };
    obj.scale = { ...kf.scale };
    vp()?.setSelectedObjectTransform(obj);
    markDirty('已调整关键帧');
  };

  const onSave = async () => {
    const a = animRef.current;
    const scene = sceneRef.current;
    if (!a || !scene) {
      setSaveState('请先选择场景');
      return;
    }
    a.name = name || 'Untitled Animation';
    a.thumbnail = vp()?.captureThumbnail();
    const input = {
      name: a.name,
      sceneId: scene.id,
      duration: a.duration,
      tracks: a.tracks,
      thumbnail: a.thumbnail,
    };
    try {
      if (savedId) await updateAnimation(savedId, input);
      else {
        const created = await createAnimation(input);
        setSavedId(created.id);
      }
      setSaveState('已保存 ✓');
    } catch (err) {
      setSaveState('保存失败：' + (err as Error).message);
    }
  };

  const anim = animRef.current;
  const duration = anim?.duration ?? 8;

  return (
    <PageShell active="animation">
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border bg-panel px-5 py-2.5">
          <a className={BTN_SM} href="#/animations">
            ← 返回
          </a>
          <input
            className="min-w-[220px] rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className={BTN_SM_PRIMARY} onClick={() => void onSave()}>
            保存
          </button>
          <span className="ml-auto text-sm text-accent">{saveState}</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[240px_1fr_340px]">
          {/* Left: scenes + animations */}
          <aside className="flex min-h-0 flex-col overflow-auto border-r border-border bg-panel p-3">
            <h4 className="pb-2 text-[13px] uppercase tracking-[0.5px] text-muted">场景 Scenes</h4>
            <div className="flex flex-col gap-1.5">
              {scenes.map((s) => (
                <div
                  key={s.id}
                  className={
                    'flex cursor-pointer items-center rounded-lg border px-2.5 py-2 text-[13px] ' +
                    (sceneRef.current?.id === s.id ? 'border-accent bg-accent text-[#06140a]' : 'border-border bg-panel-2 text-text')
                  }
                  onClick={() => void selectScene(s.id)}
                >
                  {s.name}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="pb-2 text-[13px] uppercase tracking-[0.5px] text-muted">动画 Animations</h4>
              <button className={BTN_SM_FULL} onClick={() => sceneRef.current && void createNewAnimation(sceneRef.current.id)}>
                ＋ 从场景创建动画
              </button>
              <div className="mt-2 flex flex-col gap-1.5">
                {animItems.map((a) => (
                  <div
                    key={a.id}
                    className={
                      'flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-[13px] ' +
                      (savedId === a.id ? 'border-accent bg-accent text-[#06140a]' : 'border-border bg-panel-2 text-text')
                    }
                    onClick={() => void loadAnimation(a.id)}
                  >
                    <span className="truncate">{a.name}</span>
                    <button
                      className="rounded border-none bg-transparent px-1 text-[15px] leading-none text-danger hover:bg-danger hover:text-white"
                      title="删除"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`删除动画「${a.name}」？`)) {
                          void deleteAnimation(a.id).then(() => {
                            if (savedId === a.id) {
                              animRef.current = null;
                              setSavedId(undefined);
                            }
                            void loadAnimationsForScene(sceneRef.current?.id ?? '');
                          });
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Center: toolbar + viewport */}
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-panel-2 px-3.5 py-2">
              <button className={BTN_SM} onClick={togglePlay}>
                {playing ? '⏸ 暂停' : '▶ 播放'}
              </button>
              <label className="flex items-center gap-2 text-xs text-muted">
                时间
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.01}
                  value={time}
                  onChange={(e) => onScrub(parseFloat(e.target.value))}
                  className="w-[160px] accent-accent"
                />
                <span className="tabular-nums text-text">{time.toFixed(2)}s</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-muted">
                速度
                <input
                  type="range"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={speed}
                  onChange={(e) => onSpeed(parseFloat(e.target.value) || 1)}
                  className="w-[100px] accent-accent"
                />
                <span className="tabular-nums text-text">{speed.toFixed(1)}</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-muted">
                时长(s)
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={duration}
                  onChange={(e) => onDuration(parseFloat(e.target.value) || 1)}
                  className="w-[70px] rounded border border-border bg-bg px-1.5 py-1 text-[12px] text-text"
                />
              </label>
              <span className="h-[22px] w-px bg-border" />
              <button className={BTN_SM} onClick={recCamera}>
                📷 记录相机/目标关键帧
              </button>
              <button className={BTN_SM} onClick={recObject} disabled={!selectedTrackId}>
                🎯 记录选中物件关键帧
              </button>
            </div>

            <div ref={ref} className="relative min-h-0 flex-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />
          </div>

          {/* Right: tracks + inspector + timeline */}
          <aside className="flex min-h-0 flex-col overflow-hidden border-l border-border bg-panel">
            <div className="min-h-0 flex-1 overflow-auto p-3">
              <h4 className="pb-2 text-[13px] uppercase tracking-[0.5px] text-muted">轨道 Tracks</h4>
              {!anim ? (
                <p className="text-sm text-muted">先选择一个场景并创建 / 加载动画。</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {anim.tracks.map((t) => {
                    const icon = t.kind === 'camera' ? '🎥' : t.kind === 'cameraTarget' ? '🎯' : '📦';
                    const label =
                      t.kind === 'camera' ? '相机 Camera' : t.kind === 'cameraTarget' ? '相机目标 Target' : t.label ?? '物件';
                    return (
                      <div
                        key={t.id}
                        className={
                          'flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-[13px] ' +
                          (t.id === selectedTrackId ? 'border-accent bg-accent text-[#06140a]' : 'border-border bg-panel-2 text-text')
                        }
                        onClick={() => {
                          setSelectedTrackId(t.id);
                          vp()?.selectTrack(t.id);
                          bump();
                        }}
                      >
                        <span>{icon}</span>
                        <span className="truncate">{label}</span>
                        {t.kind === 'object' && (
                          <button
                            className="ml-auto rounded border-none bg-transparent px-1 text-[14px] leading-none text-danger hover:bg-danger hover:text-white"
                            title="删除轨道"
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = anim.tracks.findIndex((x) => x.id === t.id);
                              if (idx !== -1) anim.tracks.splice(idx, 1);
                              if (selectedTrackId === t.id) setSelectedTrackId(null);
                              vp()?.refresh();
                              markDirty('已删除轨道');
                              bump();
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {sceneRef.current && anim && (
                <div className="mt-2.5">
                  <AddTrackRow
                    scene={sceneRef.current}
                    bound={boundObjectIds()}
                    onAdd={addObjectTrack}
                  />
                </div>
              )}

              <h4 className="pb-2 pt-4 text-[13px] uppercase tracking-[0.5px] text-muted">属性 Inspector</h4>
              {!anim || !selectedTrack ? (
                <p className="text-sm text-muted">
                  在上方选择一个轨道进行编辑；相机 / 目标轨道可用「记录关键帧」在时间轴上取景。
                </p>
              ) : selectedTrack.kind === 'camera' || selectedTrack.kind === 'cameraTarget' ? (
                <div className="rounded-lg border border-border p-2.5">
                  <div className="text-[12px] font-semibold text-accent">
                    {selectedTrack.kind === 'camera' ? '相机' : '相机目标'} 轨道
                  </div>
                  <p className="mt-1 text-[12px] text-muted">
                    移动视角后用工具栏「记录相机/目标关键帧」在当前时间写入关键帧（空 node）。关键帧之间线性插值。
                  </p>
                </div>
              ) : (
                selectedSceneObj && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[12px] font-semibold text-accent">
                      物件轨道：{selectedTrack.label ?? selectedSceneObj.name}
                    </div>
                    <div className="flex flex-row flex-wrap items-center gap-1.5">
                      <span className="text-xs text-muted">变换：</span>
                      {(['translate', 'rotate', 'scale'] as const).map((m) => (
                        <button
                          key={m}
                          className={transformMode === m ? BTN_SM_ACTIVE : BTN_SM}
                          onClick={() => {
                            setTransformMode(m);
                            vp()?.setTransformMode(m);
                          }}
                        >
                          {m === 'translate' ? '移动' : m === 'rotate' ? '旋转' : '缩放'}
                        </button>
                      ))}
                    </div>
                    <TrackInspector
                      track={selectedTrack}
                      obj={selectedSceneObj}
                      time={time}
                      duration={duration}
                      refresh={() => vp()?.refresh()}
                      currentKeyframe={currentKeyframe}
                      writeKF={writeKF}
                      syncObj={syncObj}
                      markDirty={markDirty}
                      bump={bump}
                    />
                  </div>
                )
              )}

              <h4 className="pb-2 pt-4 text-[13px] uppercase tracking-[0.5px] text-muted">时间轴 Timeline</h4>
              {anim && (
                <div className="flex flex-col gap-1.5">
                  {anim.tracks.map((t) => {
                    const icon = t.kind === 'camera' ? '🎥' : t.kind === 'cameraTarget' ? '🎯' : '📦';
                    return (
                      <div
                        key={t.id}
                        className={
                          'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[12px] ' +
                          (t.id === selectedTrackId ? 'border-accent' : 'border-border')
                        }
                      >
                        <span>{icon}</span>
                        <div
                          className="relative h-6 flex-1 cursor-copy rounded bg-panel-2"
                          onClick={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            const r = el.getBoundingClientRect();
                            const tt = Math.max(0, Math.min(duration, ((e.clientX - r.left) / r.width) * duration));
                            onScrub(tt);
                          }}
                        >
                          {t.keyframes.map((kf, ki) => (
                            <span
                              key={ki}
                              className={
                                'absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ' +
                                (kf.state && kf.state !== 'none' ? 'bg-[#8fe6a0] ring-2 ring-accent' : 'bg-[#8fe6a0]')
                              }
                              style={{ left: `${((kf.time / duration) * 100).toFixed(2)}%` }}
                              title={`t=${kf.time.toFixed(2)}s${kf.state && kf.state !== 'none' ? ' · ' + kf.state : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onScrub(kf.time);
                                if (t.kind === 'object') {
                                  setSelectedTrackId(t.id);
                                  vp()?.selectTrack(t.id);
                                  bump();
                                }
                              }}
                            />
                          ))}
                          <span
                            className="absolute top-0 h-full w-px bg-danger"
                            style={{ left: `${((time / duration) * 100).toFixed(2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function AddTrackRow({
  scene,
  bound,
  onAdd,
}: {
  scene: SceneComponent;
  bound: Set<string>;
  onAdd: (oid: string) => void;
}) {
  const free = scene.objects.filter((o) => !bound.has(o.id));
  const [oid, setOid] = useState(free[0]?.id ?? '');
  if (free.length === 0)
    return <p className="text-[11px] text-muted">场景中所有物件已绑定轨道（每个物件最多一个）。</p>;
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border p-2.5">
      <div className="flex items-center gap-2">
        <select
          className="flex-1 rounded-lg border border-border bg-panel-2 px-2 py-1 text-[13px] text-text"
          value={oid}
          onChange={(e) => setOid(e.target.value)}
        >
          <option value="">绑定物件…</option>
          {free.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <button className={BTN_SM_PRIMARY} onClick={() => oid && onAdd(oid)}>
          ＋ 添加轨道
        </button>
      </div>
      <p className="text-[11px] text-muted">自定义轨道绑定场景中的角色 / 元件，可调整其位置并设区段动画状态（走 / 飞）。</p>
    </div>
  );
}

function TrackInspector({
  track,
  obj,
  time,
  duration,
  refresh,
  currentKeyframe,
  writeKF,
  syncObj,
  markDirty,
  bump,
}: {
  track: AnimChannel;
  obj: SceneObject;
  time: number;
  duration: number;
  refresh: () => void;
  currentKeyframe: (track: AnimChannel, create?: boolean) => AnimKf;
  writeKF: (
    track: AnimChannel,
    t: number,
    pos: { x: number; y: number; z: number },
    rot?: { x: number; y: number; z: number },
    scale?: { x: number; y: number; z: number },
  ) => void;
  syncObj: (obj: SceneObject, track: AnimChannel) => void;
  markDirty: (msg: string) => void;
  bump: () => void;
}) {
  const kf = currentKeyframe(track);
  const make = (
    title: string,
    v: { x: number; y: number; z: number },
    set: (nv: { x: number; y: number; z: number }) => void,
  ) => (
    <Vec3Field
      title={title}
      value={v}
      onChange={(nv) => {
        set(nv);
        bump();
      }}
    />
  );
  return (
    <div className="flex flex-col gap-2">
      {make('位置 Position', kf.position, (nv) => {
        writeKF(track, time, nv, kf.rotation, kf.scale);
        syncObj(obj, track);
      })}
      {make('旋转 Rotation (rad)', kf.rotation, (nv) => {
        writeKF(track, time, kf.position, nv, kf.scale);
        syncObj(obj, track);
      })}
      {make('缩放 Scale', kf.scale, (nv) => {
        writeKF(track, time, kf.position, kf.rotation, nv);
        syncObj(obj, track);
      })}
      <div className="rounded-lg border border-border p-2.5">
        <div className="pb-1.5 text-[12px] font-semibold text-accent">区段动画状态 Segment State</div>
        <select
          className="w-full rounded-lg border border-border bg-panel-2 px-2 py-1 text-[13px] text-text"
          value={kf.state ?? 'none'}
          onChange={(e) => {
            const k = currentKeyframe(track, true);
            k.state = e.target.value as AnimState;
            refresh();
            markDirty('状态已设置');
            bump();
          }}
        >
          {STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-lg border border-border p-2.5">
        <div className="pb-1.5 text-[12px] font-semibold text-accent">关键帧 Keyframes</div>
        <div className="flex flex-col gap-1.5">
          {track.keyframes.map((k, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-4 text-[12px] text-muted">t</span>
              <input
                type="number"
                step={0.1}
                min={0}
                className="w-[70px] rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[12px] text-text"
                value={k.time.toFixed(2)}
                onChange={(e) => {
                  k.time = Math.max(0, Math.min(duration, parseFloat(e.target.value) || 0));
                  track.keyframes.sort((a, b) => a.time - b.time);
                  refresh();
                  bump();
                }}
              />
              <select
                className="flex-1 rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[12px] text-text"
                value={k.state ?? 'none'}
                onChange={(e) => {
                  k.state = e.target.value as AnimState;
                  refresh();
                  bump();
                }}
              >
                {STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                className="rounded border-none bg-transparent px-1 text-[14px] leading-none text-danger hover:bg-danger hover:text-white"
                onClick={() => {
                  track.keyframes.splice(idx, 1);
                  refresh();
                  bump();
                  markDirty('已删除关键帧');
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
