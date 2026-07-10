import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { MapViewport, type MapEditMode } from '../../lib/map-view';
import type { MapAgentResult } from '../../lib/map-agent';
import { getMap, createMap, updateMap, deleteMap } from '../../lib/map-api';
import { listAssets } from '../../lib/api';
import {
  createEmptyMap,
  createMapInstance,
  type AssetComponent,
  type MapComponent,
  type MapInstance,
} from '../../schema';
import { Vec3Field, ScaleField } from '../editor/fields';
import { MapChat } from './map/MapChat';

const BTN_SM =
  'inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent';
const BTN_SM_ACTIVE = BTN_SM + ' bg-accent border-accent text-[#06140a] font-semibold';
const BTN_SM_PRIMARY =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-[#06140a] transition-colors hover:border-accent';
const BTN_SM_DANGER =
  'inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2.5 py-1.5 text-[13px] text-danger transition-colors hover:border-danger';

type ChatMsg = { id: number; role: 'user' | 'bot'; text: string; thinking?: boolean; raw?: string };

export function MapEditorView({ id }: { id?: string }) {
  const mapRef = useRef<MapComponent>(createEmptyMap());
  const [, force] = useReducer((x: number) => x + 1, 0);
  const [ready, setReady] = useState(false);
  const [assetsList, setAssetsList] = useState<AssetComponent[]>([]);
  const assetsListRef = useRef<AssetComponent[]>([]);
  const [savedId, setSavedId] = useState<string | undefined>(id);
  const [name, setName] = useState('');
  const [mode, setMode] = useState<MapEditMode>('roam');
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [placeAsset, setPlaceAsset] = useState('');
  const [saveState, setSaveState] = useState('');
  const [chat, setChat] = useState<ChatMsg[]>([]);

  const assetSelectRef = useRef('');
  const savedIdRef = useRef<string | undefined>(id);
  const nameRef = useRef('');
  const saveTimer = useRef<number | undefined>(undefined);

  const bump = useCallback(() => force(), []);

  const vp = () => instance.current;

  const scheduleSave = useCallback(() => {
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void saveCurrent();
    }, 800);
  }, []);

  const { ref, instance } = useCanvasView(
    async (host) => {
      const m = id ? (await getMap(id)) ?? createEmptyMap('Untitled Map') : createEmptyMap('Untitled Map');
      mapRef.current = m;
      nameRef.current = m.name;
      const v = new MapViewport(host, m, {
        onSelectInstance: (iid) => {
          setSelectedInstanceId(iid);
          bump();
        },
        onPlace: (pt) => {
          const assetId = assetSelectRef.current;
          if (!assetId) return;
          const asset = assetsListRef.current.find((a) => a.id === assetId);
          const inst = createMapInstance(
            assetId,
            { x: pt.x, y: pt.y, z: pt.z },
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 1, z: 1 },
            asset?.name,
          );
          mapRef.current.instances.push(inst);
          v.refreshInstances();
          setSelectedInstanceId(inst.id);
          scheduleSave();
          bump();
        },
        onChange: () => scheduleSave(),
      });
      setReady(true);
      return v;
    },
    id,
  );

  useEffect(() => {
    if (!ready || !instance.current) return;
    void (async () => {
      const list = await listAssets();
      setAssetsList(list);
      assetsListRef.current = list;
      instance.current?.setAssets(new Map(list.map((a) => [a.id, a])));
      bump();
    })();
  }, [ready, instance, bump]);

  useEffect(() => {
    if (ready) setName(mapRef.current.name);
  }, [ready]);

  const setModeAnd = (m: MapEditMode) => {
    setMode(m);
    vp()?.setMode(m);
  };

  const setWater = (level: number, enabled: boolean, color: string) => {
    mapRef.current.water = { level, enabled, color };
    vp()?.setWater(level, enabled);
    scheduleSave();
    bump();
  };

  const applyMapUpdate = (next: MapComponent) => {
    mapRef.current = next;
    nameRef.current = next.name;
    setName(next.name);
    setSavedId(savedIdRef.current);
    vp()?.setData(next, new Map(assetsList.map((a) => [a.id, a])));
    bump();
  };

  const saveCurrent = useCallback(async (): Promise<'created' | 'updated' | 'failed'> => {
    const map = mapRef.current;
    map.name = nameRef.current || 'Untitled Map';
    let thumb: string | undefined;
    try {
      thumb = vp()?.captureThumbnail();
    } catch {
      /* best effort */
    }
    map.thumbnail = thumb;
    const input = {
      name: map.name,
      description: map.description,
      size: map.size,
      terrain: map.terrain,
      water: map.water,
      instances: map.instances,
      thumbnail: map.thumbnail,
    };
    try {
      if (savedIdRef.current) {
        await updateMap(savedIdRef.current, input);
        return 'updated';
      }
      const created = await createMap(input);
      savedIdRef.current = created.id;
      map.id = created.id;
      map.createdAt = created.createdAt;
      map.updatedAt = created.updatedAt;
      setSavedId(created.id);
      return 'created';
    } catch (err) {
      setSaveState('保存失败：' + (err as Error).message);
      return 'failed';
    }
  }, []);

  const onSave = async () => {
    const status = await saveCurrent();
    if (status !== 'failed') setSaveState('已保存 ✓');
  };

  const onDelete = async () => {
    if (!savedIdRef.current) return;
    if (!window.confirm('确定删除该地图？')) return;
    await deleteMap(savedIdRef.current);
    location.hash = '#/maps';
  };

  const selectedInst: MapInstance | null = selectedInstanceId
    ? mapRef.current.instances.find((i) => i.id === selectedInstanceId) ?? null
    : null;

  const updateInst = (inst: MapInstance, patch: Partial<MapInstance>) => {
    Object.assign(inst, patch);
    vp()?.refreshInstances();
    scheduleSave();
    bump();
  };

  const removeInst = (iid: string) => {
    const idx = mapRef.current.instances.findIndex((i) => i.id === iid);
    if (idx === -1) return;
    mapRef.current.instances.splice(idx, 1);
    if (selectedInstanceId === iid) setSelectedInstanceId(null);
    vp()?.refreshInstances();
    scheduleSave();
    bump();
  };

  const onChatResult = (result: MapAgentResult) => {
    if (result.map) {
      applyMapUpdate(result.map);
      const status = saveCurrent();
      void status.then((s) =>
        setSaveState(s === 'failed' ? 'AI 结果已载入，但自动保存失败（可手动保存）' : 'AI 已修改并保存 ✓'),
      );
    }
  };

  const water = mapRef.current.water;

  return (
    <PageShell active="map">
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border bg-panel px-5 py-2.5">
          <a className={BTN_SM} href="#/maps">
            ← 返回
          </a>
          <input
            className="min-w-[220px] rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              nameRef.current = e.target.value;
            }}
          />
          <button className={BTN_SM_PRIMARY} onClick={() => void onSave()}>
            保存
          </button>
          {savedId && (
            <button className={BTN_SM_DANGER} onClick={() => void onDelete()}>
              删除
            </button>
          )}
          <span className="ml-auto text-sm text-accent">{saveState}</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[240px_1fr_340px]">
          {/* Left: tools + placed instances */}
          <aside className="flex flex-col overflow-auto border-r border-border bg-panel p-3">
            <h4 className="pb-2 text-[13px] uppercase tracking-[0.5px] text-muted">编辑模式</h4>
            <div className="flex flex-wrap gap-1.5">
              {(['roam', 'raise', 'lower', 'flatten'] as MapEditMode[]).map((m) => (
                <button key={m} className={mode === m ? BTN_SM_ACTIVE : BTN_SM} onClick={() => setModeAnd(m)}>
                  {m === 'roam' ? '漫游' : m === 'raise' ? '抬升' : m === 'lower' ? '降低' : '平整'}
                </button>
              ))}
            </div>

            <h4 className="pb-2 pt-4 text-[13px] uppercase tracking-[0.5px] text-muted">水域 Water</h4>
            <label className="flex items-center gap-2 py-1 text-xs text-muted">
              <input
                type="checkbox"
                checked={water.enabled}
                onChange={(e) => setWater(water.level, e.target.checked, water.color)}
              />
              显示水域
            </label>
            <label className="flex items-center gap-1.5 py-1 text-xs text-muted">
              水位 Level
              <input
                type="range"
                min={-3}
                max={6}
                step={0.1}
                value={water.level}
                onChange={(e) => setWater(parseFloat(e.target.value), water.enabled, water.color)}
                className="w-full accent-accent"
              />
            </label>
            <label className="flex items-center gap-2 py-1 text-xs text-muted">
              颜色
              <input
                type="color"
                value={water.color}
                onChange={(e) => setWater(water.level, water.enabled, e.target.value)}
              />
            </label>

            <h4 className="pb-2 pt-4 text-[13px] uppercase tracking-[0.5px] text-muted">放置元件</h4>
            <select
              className="rounded-lg border border-border bg-panel-2 px-2 py-1 text-sm text-text"
              value={placeAsset}
              onChange={(e) => {
                setPlaceAsset(e.target.value);
                assetSelectRef.current = e.target.value;
                if (e.target.value) setModeAnd('place');
                else setModeAnd('roam');
                vp()?.setPlaceAsset(e.target.value || null);
              }}
            >
              <option value="">选择元件…</option>
              {assetsList.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <h4 className="pb-2 pt-4 text-[13px] uppercase tracking-[0.5px] text-muted">已放置元件</h4>
            <div className="flex flex-col gap-1.5">
              {mapRef.current.instances.length === 0 ? (
                <p className="text-[11px] text-muted">暂无元件。选择元件后进入「放置模式」点击地形添加。</p>
              ) : (
                mapRef.current.instances.map((inst) => {
                  const asset = assetsList.find((a) => a.id === inst.assetId);
                  return (
                    <div
                      key={inst.id}
                      className={
                        'flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-2.5 py-2 ' +
                        (inst.id === selectedInstanceId ? 'border-accent bg-accent text-[#06140a]' : 'border-border bg-panel-2 text-text')
                      }
                      onClick={(e) => {
                        if ((e.target as HTMLElement).classList.contains('row-del')) return;
                        setModeAnd('select');
                        setSelectedInstanceId(inst.id);
                        vp()?.setSelectedInstance(inst.id);
                      }}
                    >
                      <span className="text-[13px]">● {inst.name ?? asset?.name ?? inst.assetId}</span>
                      <button
                        className="row-del rounded border-none bg-transparent p-1 text-[15px] leading-none text-danger hover:bg-danger hover:text-white"
                        title="删除该元件"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeInst(inst.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* Center: viewport */}
          <div ref={ref} className="relative min-h-0 flex-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />

          {/* Right: inspector + chat */}
          <aside className="flex min-h-0 flex-col overflow-hidden border-l border-border bg-panel">
            <div className="min-h-0 flex-1 overflow-auto p-3">
              <h4 className="pb-2 text-[13px] uppercase tracking-[0.5px] text-muted">属性 Inspector</h4>
              {selectedInst ? (
                <div className="flex flex-col gap-2">
                  <div className="text-[12px] font-semibold text-accent">
                    {assetsList.find((a) => a.id === selectedInst.assetId)?.name ?? selectedInst.assetId}
                  </div>
                  <Vec3Field
                    title="位置 Position"
                    value={selectedInst.position}
                    onChange={(v) => updateInst(selectedInst, { position: v })}
                  />
                  <Vec3Field
                    title="旋转 Rotation (rad)"
                    value={selectedInst.rotation}
                    onChange={(v) => updateInst(selectedInst, { rotation: v })}
                  />
                  <ScaleField value={selectedInst.scale} onChange={(v) => updateInst(selectedInst, { scale: v })} />
                  <button className={BTN_SM_DANGER + ' w-full justify-center'} onClick={() => removeInst(selectedInst.id)}>
                    删除此元件
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <p className="text-sm text-muted">
                    在视图或列表中选择一个已放置元件以编辑其变换。
                  </p>
                  <div className="rounded-lg border border-border p-2.5">
                    <div className="pb-1.5 text-[12px] font-semibold text-accent">地图信息</div>
                    <div className="text-[12px] text-muted">名称：{mapRef.current.name}</div>
                    <div className="text-[12px] text-muted">
                      尺寸：{mapRef.current.size} × {mapRef.current.size}
                    </div>
                    <div className="text-[12px] text-muted">
                      地形网格：{mapRef.current.terrain.segments + 1} × {mapRef.current.terrain.segments + 1}
                    </div>
                    <div className="text-[12px] text-muted">
                      水域：{mapRef.current.water.enabled ? `开启 (level ${mapRef.current.water.level})` : '关闭'}
                    </div>
                    <div className="text-[12px] text-muted">元件数：{mapRef.current.instances.length}</div>
                  </div>
                  <NumField
                    label="地图边长 Size"
                    value={mapRef.current.size}
                    onChange={(v) => {
                      mapRef.current.size = v;
                      vp()?.setSize(v);
                      scheduleSave();
                      bump();
                    }}
                  />
                </div>
              )}
            </div>
            <div className="border-t border-border">
              <MapChat
                messages={chat}
                setMessages={setChat}
                onResult={onChatResult}
                context={{ map: mapRef.current, assets: assetsList, selectedInstanceId, isNew: !savedIdRef.current }}
              />
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-[12px] text-muted">
      <span>{label}</span>
      <input
        className="w-full rounded-md border border-border bg-panel-2 px-2 py-1.5 text-[13px] text-text"
        type="number"
        step={1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </label>
  );
}
