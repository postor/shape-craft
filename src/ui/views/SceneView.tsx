import { useCallback, useEffect, useState } from 'react';
import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { SceneViewport, type SceneMode, type TerrainTool } from '../../lib/scene-view';
import type { TransformMode } from '../../lib/three-view';
import {
  listScenes,
  getScene,
  createScene,
  updateScene,
  deleteScene,
} from '../../lib/scene-api';
import { listAssets } from '../../lib/api';
import {
  createEmptyScene,
  type AssetComponent,
  type SceneComponent,
  type SceneObject,
} from '../../schema';
import { Vec3Field, ScaleField } from '../editor/fields';

const BTN_SM =
  'inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent';
const BTN_SM_ACTIVE = BTN_SM + ' bg-accent border-accent text-[#06140a] font-semibold';
const BTN_SM_PRIMARY =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-[#06140a] transition-colors hover:border-accent';
const BTN_SM_DANGER =
  'inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2.5 py-1.5 text-[13px] text-danger transition-colors hover:border-danger';
const BTN_SM_FULL = BTN_SM + ' w-full justify-center';

export function SceneView({ id }: { id?: string }) {
  const [assets, setAssets] = useState<AssetComponent[]>([]);
  const [scenes, setScenes] = useState<SceneComponent[]>([]);
  const [ready, setReady] = useState(false);
  const [scene, setScene] = useState<SceneComponent>(() => createEmptyScene());
  const [savedId, setSavedId] = useState<string | undefined>(id);
  const [name, setName] = useState(scene.name);
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveStateText] = useState('');
  const [mode, setMode] = useState<SceneMode>('terrain');
  const [terrainTool, setTerrainTool] = useState<TerrainTool>('raise');
  const [brushSize, setBrushSize] = useState(3);
  const [brushStrength, setBrushStrength] = useState(0.6);
  const [waterLevel, setWaterLevel] = useState(scene.waterLevel);
  const [transformMode, setTransformMode] = useState<TransformMode>('translate');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [armedAsset, setArmedAsset] = useState('');

  const markDirty = useCallback((msg: string) => {
    setDirty(true);
    setSaveStateText(msg + '（未保存）');
  }, []);

  const { ref, instance } = useCanvasView(
    (host) => {
      const vp = new SceneViewport(host, {
        onTerrainChange: () => markDirty('地形已修改'),
        onObjectAdd: () => markDirty('已放置物件'),
        onObjectChange: () => markDirty('物件已移动'),
        onSelect: (oid) => setSelectedId(oid),
      });
      setReady(true);
      return vp;
    },
    id,
  );

  const reloadList = useCallback(async () => {
    setScenes(await listScenes());
  }, []);

  useEffect(() => {
    void (async () => setAssets(await listAssets()))();
  }, []);

  useEffect(() => {
    if (!ready || !instance.current) return;
    void instance.current.setScene(scene, assets);
  }, [ready, instance, scene, assets]);

  useEffect(() => {
    void reloadList();
  }, [reloadList]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const loadScene = useCallback(
    async (sid: string) => {
      const s = await getScene(sid);
      if (!s) return;
      setSavedId(sid);
      setScene(s);
      setName(s.name);
      setWaterLevel(s.waterLevel);
      setDirty(false);
      setSaveStateText('');
      setSelectedId(null);
      await reloadList();
    },
    [reloadList],
  );

  const newScene = () => {
    setSavedId(undefined);
    const s = createEmptyScene();
    setScene(s);
    setName(s.name);
    setWaterLevel(s.waterLevel);
    setDirty(false);
    setSaveStateText('');
    setSelectedId(null);
    void reloadList();
  };

  const onSave = async () => {
    const sc = scene;
    sc.name = name || 'Untitled Scene';
    if (instance.current) sc.thumbnail = instance.current.captureThumbnail();
    const input = {
      name: sc.name,
      size: sc.size,
      waterLevel: sc.waterLevel,
      terrain: sc.terrain,
      objects: sc.objects,
      thumbnail: sc.thumbnail,
    };
    try {
      if (savedId) await updateScene(savedId, input);
      else {
        const created = await createScene(input);
        setSavedId(created.id);
      }
      setDirty(false);
      setSaveStateText('已保存 ✓');
      await reloadList();
    } catch (err) {
      setSaveStateText('保存失败：' + (err as Error).message);
    }
  };

  const selectedObj: SceneObject | undefined = selectedId
    ? scene.objects.find((o) => o.id === selectedId)
    : undefined;

  const applyBrush = () => instance.current?.setBrush(brushSize, brushStrength);

  const onModeChange = (m: SceneMode) => {
    setMode(m);
    instance.current?.setMode(m);
  };

  return (
    <PageShell active="scene">
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border bg-panel px-5 py-2.5">
          <a className={BTN_SM} href="#/scenes">
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

        <div className="grid min-h-0 flex-1 grid-cols-[240px_1fr_320px]">
          {/* Left: scene list */}
          <aside className="flex flex-col overflow-auto border-r border-border bg-panel p-3">
            <h4 className="px-1 pb-2 text-[13px] uppercase tracking-[0.5px] text-muted">场景 Scenes</h4>
            <button className={BTN_SM_FULL} onClick={newScene}>
              + 新建场景
            </button>
            <div className="mt-2 flex flex-col gap-1.5">
              {scenes.map((s) => (
                <div
                  key={s.id}
                  className={
                    'flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-panel-2 px-2.5 py-2 ' +
                    (s.id === savedId ? 'outline outline-1 outline-accent' : '')
                  }
                  onClick={async (e) => {
                    if ((e.target as HTMLElement).classList.contains('sdel')) return;
                    await loadScene(s.id);
                  }}
                >
                  <span className="truncate text-sm">{s.name}</span>
                  <button
                    className="rounded border-none bg-transparent p-1 text-[15px] leading-none text-[#e57373] hover:bg-danger hover:text-white"
                    title="删除"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm(`删除场景「${s.name}」？`)) {
                        await deleteScene(s.id);
                        if (savedId === s.id) setSavedId(undefined);
                        await reloadList();
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </aside>

          {/* Center: tabs + toolbar + viewport */}
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <div className="flex gap-1.5 border-b border-border bg-panel-2 p-2.5">
              <button
                className={mode === 'terrain' ? BTN_SM_ACTIVE : BTN_SM}
                onClick={() => onModeChange('terrain')}
              >
                ⛰️ 地形 Terrain
              </button>
              <button
                className={mode === 'object' ? BTN_SM_ACTIVE : BTN_SM}
                onClick={() => onModeChange('object')}
              >
                📦 物件 Object
              </button>
            </div>

            <div className="flex flex-row flex-wrap items-center gap-2 border-b border-border bg-panel-2 px-3.5 py-2">
              {mode === 'terrain' ? (
                <>
                  <span className="text-xs text-muted">笔刷：</span>
                  {(['raise', 'lower', 'flatten'] as TerrainTool[]).map((t) => (
                    <button
                      key={t}
                      className={terrainTool === t ? BTN_SM_ACTIVE : BTN_SM}
                      onClick={() => {
                        setTerrainTool(t);
                        instance.current?.setTerrainTool(t);
                      }}
                    >
                      {t === 'raise' ? '抬高 ▲' : t === 'lower' ? '降低 ▼' : '平整 ⬌'}
                    </button>
                  ))}
                  <span className="h-[22px] w-px bg-border" />
                  <span className="text-xs text-muted">水体：</span>
                  <button
                    className={BTN_SM}
                    onClick={() => {
                      setTerrainTool('water');
                      instance.current?.setTerrainTool('water');
                    }}
                  >
                    💧 注水
                  </button>
                  <button
                    className={BTN_SM}
                    onClick={() => {
                      setTerrainTool('dry');
                      instance.current?.setTerrainTool('dry');
                    }}
                  >
                    🚫 排水
                  </button>
                  <span className="h-[22px] w-px bg-border" />
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    半径
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={0.5}
                      value={brushSize}
                      onChange={(e) => {
                        setBrushSize(parseFloat(e.target.value));
                        applyBrush();
                      }}
                      className="w-[110px] accent-accent"
                    />
                    <span className="min-w-[20px] tabular-nums text-text">{brushSize}</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    强度
                    <input
                      type="range"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={brushStrength}
                      onChange={(e) => {
                        setBrushStrength(parseFloat(e.target.value));
                        applyBrush();
                      }}
                      className="w-[110px] accent-accent"
                    />
                    <span className="min-w-[20px] tabular-nums text-text">{brushStrength}</span>
                  </label>
                  <span className="h-[22px] w-px bg-border" />
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    水位
                    <input
                      type="range"
                      min={-scene.size / 2}
                      max={scene.size / 2}
                      step={0.1}
                      value={waterLevel}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setWaterLevel(v);
                        instance.current?.setWaterLevel(v);
                        markDirty('水位已调整');
                      }}
                      className="w-[110px] accent-accent"
                    />
                    <span className="min-w-[20px] tabular-nums text-text">{waterLevel.toFixed(1)}</span>
                  </label>
                  <span className="h-[22px] w-px bg-border" />
                  <button
                    className={BTN_SM_DANGER}
                    onClick={() => {
                      const sc = scene;
                      sc.terrain.heights = sc.terrain.heights.map(() => 0);
                      sc.terrain.water = sc.terrain.water.map(() => 0);
                      setScene({ ...sc });
                      void instance.current?.setScene(sc, assets);
                      markDirty('地形已重置');
                    }}
                  >
                    重置地形
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-muted">放置元件：</span>
                  <select
                    className="rounded-lg border border-border bg-panel-2 px-2 py-1 text-sm text-text"
                    value={armedAsset}
                    onChange={(e) => {
                      setArmedAsset(e.target.value);
                      instance.current?.armPlacement(e.target.value || null);
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
                    className={BTN_SM_PRIMARY}
                    onClick={() => instance.current?.armPlacement(armedAsset || null)}
                  >
                    放置（点击地形）
                  </button>
                  <span className="h-[22px] w-px bg-border" />
                  <span className="text-xs text-muted">变换：</span>
                  {(['translate', 'rotate', 'scale'] as TransformMode[]).map((m) => (
                    <button
                      key={m}
                      className={transformMode === m ? BTN_SM_ACTIVE : BTN_SM}
                      onClick={() => {
                        setTransformMode(m);
                        instance.current?.setTransformMode(m);
                      }}
                    >
                      {m === 'translate' ? '移动' : m === 'rotate' ? '旋转' : '缩放'}
                    </button>
                  ))}
                  <span className="h-[22px] w-px bg-border" />
                  <button
                    className={BTN_SM_DANGER}
                    onClick={() => {
                      instance.current?.deleteSelected();
                      markDirty('已删除物件');
                      setSelectedId(null);
                    }}
                  >
                    删除选中
                  </button>
                </>
              )}
            </div>

            <div
              ref={ref}
              className="relative min-h-0 flex-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
            />
          </div>

          {/* Right: inspector */}
          <aside className="flex min-h-0 flex-col overflow-hidden border-l border-border bg-panel">
            <h4 className="px-3.5 pb-2 pt-3.5 text-[13px] uppercase tracking-[0.5px] text-muted">
              属性 Inspector
            </h4>
            <div className="min-h-0 flex-1 overflow-auto p-3">
              {selectedObj ? (
                <div className="flex flex-col gap-2">
                  <div className="text-[12px] font-semibold text-accent">物件：{selectedObj.name}</div>
                  <Vec3Field
                    title="位置 Position"
                    value={selectedObj.position}
                    onChange={(v) => {
                      selectedObj.position = v;
                      instance.current?.syncTransform(selectedObj);
                      markDirty('物件已调整');
                    }}
                  />
                  <Vec3Field
                    title="旋转 Rotation (rad)"
                    value={selectedObj.rotation}
                    onChange={(v) => {
                      selectedObj.rotation = v;
                      instance.current?.syncTransform(selectedObj);
                      markDirty('物件已调整');
                    }}
                  />
                  <ScaleField
                    value={selectedObj.scale}
                    onChange={(v) => {
                      selectedObj.scale = v;
                      instance.current?.syncTransform(selectedObj);
                      markDirty('物件已调整');
                    }}
                  />
                </div>
              ) : mode === 'object' ? (
                <p className="text-sm text-muted">
                  选择「放置」后点击地形放置元件；点击已放置的元件可在此调整变换。
                </p>
              ) : (
                <p className="text-sm text-muted">
                  地形模式：左键拖动笔刷抬高/降低地形，右键拖动旋转视角，滚轮缩放。用「注水/排水」笔刷在地形上画局部河流与池塘，用水位滑块控制全局水面高度。
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
