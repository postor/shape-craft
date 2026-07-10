import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { Viewport, type TransformMode } from '../../lib/three-view';
import { CharacterAnimator } from '../../lib/character-anim';
import { resolveRefs, buildInstanceReference, findPart, type RefMap } from '../../lib/instance';
import { createDimensionOverlay } from '../../lib/ruler';
import { getAsset, createAsset, updateAsset, deleteAsset, listAssets } from '../../lib/api';
import {
  createPart,
  createEmptyAsset,
  defaultMaterial,
  vec3,
  type AssetComponent,
  type AssetPart,
  type AnimClip,
  type CharacterType,
  CHARACTER_TYPES,
  CHARACTER_TYPE_LABEL,
  CHARACTER_CLIPS,
  buildCharacterAsset,
} from '../../schema';
import { categoryLabel } from '../../lib/labels';
import { Vec3Field, ScaleField } from '../editor/fields';
import { CharacterAnimPanel } from './character/CharacterAnimPanel';

const BTN_SM =
  'inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent';
const BTN_SM_ACTIVE = BTN_SM + ' bg-accent border-accent text-[#06140a] font-semibold';
const BTN_SM_PRIMARY =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-[#06140a] transition-colors hover:border-accent';
const BTN_SM_DANGER =
  'inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2.5 py-1.5 text-[13px] text-danger transition-colors hover:border-danger';
const BTN_SM_FULL = BTN_SM + ' w-full justify-center';

const SHAPES: AssetPart['shape'][] = ['box', 'sphere', 'cylinder', 'cone', 'plane', 'node'];

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
  for (const c of node.children) if (removePart(c, id)) return true;
  return false;
}

export function CharactersView({ type, id }: { type?: string; id?: string }) {
  const initialType: CharacterType = (CHARACTER_TYPES as string[]).includes(type ?? '')
    ? (type as CharacterType)
    : 'humanoid';
  const assetRef = useRef<AssetComponent>(
    id
      ? createEmptyAsset('Untitled', 'character')
      : ({ ...createEmptyAsset(initialType, 'character'), ...buildCharacterAsset(initialType) } as AssetComponent),
  );
  const [characterType, setCharacterType] = useState<CharacterType>(initialType);
  const characterTypeRef = useRef<CharacterType>(initialType);

  const animatorRef = useRef<CharacterAnimator | null>(null);
  const overlayRef = useRef<((d: { x: number; y: number; z: number }) => void) | null>(null);
  const [, force] = useReducer((x: number) => x + 1, 0);
  const bump = useCallback(() => force(), []);

  const [ready, setReady] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>(id);
  const [name, setName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [selectedKf, setSelectedKf] = useState<{ clip: number; track: number; kf: number } | null>(null);
  const [saveState, setSaveState] = useState('');
  const [transformMode, setTransformMode] = useState<TransformMode>('rotate');
  const [refs, setRefs] = useState<AssetComponent[]>([]);
  const [dims, setDims] = useState({ x: 0, y: 0, z: 0 });

  const nameRef = useRef('');
  const savedIdRef = useRef<string | undefined>(id);
  const selectedRef = useRef<string | null>(null);

  const getClips = (): AnimClip[] => {
    if (!assetRef.current.animClips) assetRef.current.animClips = cloneClips(CHARACTER_CLIPS[characterTypeRef.current]);
    return assetRef.current.animClips;
  };
  const boneList = (): string[] => {
    const out: string[] = [];
    const walk = (p: AssetPart) => {
      if (p.shape === 'node') out.push(p.name);
      p.children.forEach(walk);
    };
    walk(assetRef.current.root);
    return out;
  };
  const applyClips = () => {
    const vp = instance.current;
    const animator = animatorRef.current;
    if (!animator) return;
    animator.setClips(getClips());
    if (vp) animator.rebind(vp.getRootGroup());
    if (activeClip) animator.play(activeClip);
  };
  const refresh = () => {
    const vp = instance.current;
    if (!vp) return;
    void resolveRefs(assetRef.current.root).then((r: RefMap) => {
      vp.setRoot(assetRef.current.root, (rid) => r.get(rid) ?? null);
      animatorRef.current?.rebind(vp.getRootGroup());
      if (selectedRef.current) vp.setSelected(selectedRef.current);
    });
  };
  const refreshAll = () => {
    refresh();
    const vp = instance.current;
    if (vp) setDims(vp.getDimensions());
    bump();
  };

  const selectPart = (pid: string | null) => {
    selectedRef.current = pid;
    setSelectedId(pid);
    instance.current?.setSelected(pid);
    bump();
  };

  const { ref, instance } = useCanvasView(
    async (host) => {
      const vp = new Viewport(
        host,
        (pid) => selectPart(pid),
        (pid, t) => {
          const part = findPart(assetRef.current.root, pid);
          if (!part) return;
          part.position = t.position;
          part.rotation = t.rotation;
          part.scale = t.scale;
          bump();
        },
      );
      const animator = new CharacterAnimator(vp.getRootGroup());
      animator.setClips(getClips());
      vp.onFrame((dt) => animator.update(dt));
      animatorRef.current = animator;
      const stopOverlay = createDimensionOverlay(host);
      overlayRef.current = (d) => {
        setDims(d);
        stopOverlay(d);
      };
      refresh();
      const first = getClips()[0];
      if (first) {
        setActiveClip(first.name);
        animator.play(first.name);
      }
      setReady(true);
      return vp;
    },
    `${type}|${id}`,
  );

  useEffect(() => {
    if (!ready) return;
    const vp = instance.current;
    if (vp && overlayRef.current) overlayRef.current(vp.getDimensions());
  }, [ready, instance, selectedId]);

  useEffect(() => {
    void (async () => {
      if (id) {
        const existing = await getAsset(id);
        if (existing) {
          assetRef.current = existing;
          if (existing.characterType) {
            characterTypeRef.current = existing.characterType;
            setCharacterType(existing.characterType);
          }
          setName(existing.name);
          nameRef.current = existing.name;
          const first = getClips()[0];
          if (first) setActiveClip(first.name);
          refresh();
          applyClips();
        }
      } else {
        setName(assetRef.current.name);
        nameRef.current = assetRef.current.name;
      }
      setRefs(await listAssets());
      bump();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPrimitive = (shape: AssetPart['shape']) => {
    let parent = (selectedRef.current && findPart(assetRef.current.root, selectedRef.current)) || assetRef.current.root;
    if (parent.shape === 'instance') parent = assetRef.current.root;
    const isNode = shape === 'node';
    const part = createPart({
      shape,
      name: isNode
        ? `Node ${parent.children.length + 1}`
        : `${shape[0].toUpperCase()}${shape.slice(1)} ${parent.children.length + 1}`,
      material: defaultMaterial(shape === 'sphere' || shape === 'cone' ? '#4caf50' : '#cccccc'),
      size:
        shape === 'box'
          ? vec3(0.3, 0.3, 0.3)
          : shape === 'sphere'
            ? vec3(0.2, 0.2, 0.2)
            : shape === 'plane'
              ? vec3(0.5, 0.5, 1)
              : vec3(0.15, 0.5, 0.15),
      position: vec3(0, isNode ? 0 : 0.2, 0),
    });
    parent.children.push(part);
    selectPart(part.id);
    refreshAll();
  };

  const insertRef = (refId: string, refName: string) => {
    const inst = buildInstanceReference({
      root: assetRef.current.root,
      selectedId: selectedRef.current,
      refId,
      refName,
    });
    selectPart(inst.id);
    refreshAll();
  };

  const changeType = (t: CharacterType) => {
    characterTypeRef.current = t;
    setCharacterType(t);
    assetRef.current = {
      ...createEmptyAsset(t, 'character'),
      ...buildCharacterAsset(t),
    } as AssetComponent;
    savedIdRef.current = undefined;
    setSavedId(undefined);
    setCollapsed(new Set());
    const first = getClips()[0];
    setActiveClip(first ? first.name : null);
    applyClips();
    setName(assetRef.current.name);
    nameRef.current = assetRef.current.name;
    selectPart(null);
    refreshAll();
  };

  const setMode = (m: TransformMode) => {
    setTransformMode(m);
    instance.current?.setTransformMode(m);
  };

  const captureShot = () => {
    const vp = instance.current;
    if (!vp) return;
    assetRef.current.thumbnail = vp.captureThumbnail();
    if (savedIdRef.current) {
      void updateAsset(savedIdRef.current, buildInput());
      setSaveState('已截图并保存 ✓');
    } else {
      setSaveState('已截图（保存后将按当前视图刷新）');
    }
  };

  const buildInput = () => ({
    name: assetRef.current.name,
    category: assetRef.current.category,
    description: assetRef.current.description,
    root: assetRef.current.root,
    thumbnail: assetRef.current.thumbnail,
    characterType: characterTypeRef.current,
    animClips: getClips(),
  });

  const saveCurrent = async (): Promise<'created' | 'updated' | 'failed'> => {
    assetRef.current.name = nameRef.current || 'Untitled';
    assetRef.current.category = 'character';
    assetRef.current.thumbnail = instance.current?.captureThumbnail();
    try {
      if (savedIdRef.current) {
        await updateAsset(savedIdRef.current, buildInput());
        return 'updated';
      }
      const created = await createAsset(buildInput());
      savedIdRef.current = created.id;
      assetRef.current.id = created.id;
      assetRef.current.createdAt = created.createdAt;
      assetRef.current.updatedAt = created.updatedAt;
      setSavedId(created.id);
      setRefs(await listAssets());
      return 'created';
    } catch (err) {
      setSaveState('保存失败：' + (err as Error).message);
      return 'failed';
    }
  };

  const onSave = async () => {
    const status = await saveCurrent();
    if (status !== 'failed') setSaveState('已保存到元件库 ✓');
  };

  const onDelete = async () => {
    if (!savedIdRef.current) return;
    if (!window.confirm('确定删除该角色？')) return;
    await deleteAsset(savedIdRef.current);
    location.hash = '#/library';
  };

  const selectedPart: AssetPart | null = selectedId ? findPart(assetRef.current.root, selectedId) : null;

  return (
    <PageShell active="characters">
      <div className="flex h-screen flex-col overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-border bg-panel px-5 py-2.5">
          <a className={BTN_SM} href="#/library">
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
          <span className="rounded-full border border-border bg-panel-2 px-2.5 py-1 text-[12px] text-muted">
            {categoryLabel('character')}
          </span>
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

        <div className="grid min-h-0 flex-1 grid-cols-[240px_1fr_360px]">
          <aside className="flex min-h-0 flex-col overflow-auto border-r border-border bg-panel p-3">
            <h4 className="pb-2 text-[13px] uppercase tracking-[0.5px] text-muted">骨架层级</h4>
            <PartNode
              part={assetRef.current.root}
              isRoot
              selectedId={selectedId}
              onSelect={selectPart}
              onDelete={(pid) => {
                removePart(assetRef.current.root, pid);
                if (selectedRef.current === pid) selectPart(null);
                refreshAll();
              }}
            />
          </aside>

          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <div className="flex flex-row flex-wrap items-center gap-2 border-b border-border bg-panel-2 px-3.5 py-2">
              <span className="text-xs text-muted">类别：</span>
              {CHARACTER_TYPES.map((t) => (
                <button key={t} className={characterType === t ? BTN_SM_ACTIVE : BTN_SM} onClick={() => changeType(t)}>
                  {CHARACTER_TYPE_LABEL[t]}
                </button>
              ))}
              <span className="h-[22px] w-px bg-border" />
              <span className="text-xs text-muted">变换：</span>
              {(['rotate', 'translate', 'scale'] as TransformMode[]).map((m) => (
                <button key={m} className={transformMode === m ? BTN_SM_ACTIVE : BTN_SM} onClick={() => setMode(m)}>
                  {m === 'rotate' ? '旋转' : m === 'translate' ? '拖拽' : '缩放'}
                </button>
              ))}
              <span className="h-[22px] w-px bg-border" />
              <button className={BTN_SM} onClick={captureShot}>
                📷 截图
              </button>
              <span className="h-[22px] w-px bg-border" />
              <span className="text-xs text-muted">添加：</span>
              {SHAPES.map((s) => (
                <button key={s} className={BTN_SM} onClick={() => addPrimitive(s)}>
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
              <span className="h-[22px] w-px bg-border" />
              <span className="text-xs text-muted">引用：</span>
              <select
                className="rounded-lg border border-border bg-panel-2 px-2 py-1 text-sm text-text"
                onChange={(e) => {
                  const rid = e.target.value;
                  if (rid) {
                    const a = refs.find((x) => x.id === rid);
                    insertRef(rid, a?.name ?? 'Instance');
                    e.target.value = '';
                  }
                }}
              >
                <option value="">选择元件…</option>
                {refs
                  .filter((a) => a.id !== savedIdRef.current)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} · {a.category}
                    </option>
                  ))}
              </select>
            </div>

            <div ref={ref} className="relative min-h-0 flex-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full">
              <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex gap-2 rounded-md bg-[rgba(16,19,26,0.7)] px-2 py-1 text-[11px] font-medium tabular-nums text-text">
                <span className="text-[#e5484d]">X {dims.x.toFixed(2)}m</span>
                <span className="text-[#46a758]">Y {dims.y.toFixed(2)}m</span>
                <span className="text-[#4f8cff]">Z {dims.z.toFixed(2)}m</span>
              </div>
            </div>
          </div>

          <aside className="flex min-h-0 flex-col overflow-hidden border-l border-border bg-panel">
            <div className="min-h-0 flex-1 overflow-auto p-3">
              <h4 className="pb-2 text-[13px] uppercase tracking-[0.5px] text-muted">动画 Animation</h4>
              <CharacterAnimPanel
                clips={getClips()}
                bones={boneList()}
                activeClip={activeClip}
                collapsed={collapsed}
                selectedKf={selectedKf}
                animator={animatorRef}
                getRootY={(y) => {
                  const vp = instance.current;
                  if (vp) vp.getRootGroup().rotation.y = y;
                }}
                onClipsChange={(next) => {
                  assetRef.current.animClips = next;
                  applyClips();
                  bump();
                }}
                onActiveClip={(name) => {
                  setActiveClip(name);
                  animatorRef.current?.play(name);
                }}
                onToggleCollapse={(i) =>
                  setCollapsed((prev) => {
                    const n = new Set(prev);
                    if (n.has(i)) n.delete(i);
                    else n.add(i);
                    return n;
                  })
                }
                onSelectKf={setSelectedKf}
              />

              <h4 className="pb-2 pt-4 text-[13px] uppercase tracking-[0.5px] text-muted">属性 Inspector</h4>
              {selectedPart ? (
                selectedPart.shape === 'instance' ? (
                  <InstanceForm
                    part={selectedPart}
                    onName={(n) => {
                      selectedPart.name = n;
                      refreshAll();
                    }}
                    onOpen={() => {
                      if (selectedPart.refId) location.hash = '#/editor/' + selectedPart.refId;
                    }}
                    onDelete={() => {
                      removePart(assetRef.current.root, selectedPart.id);
                      selectPart(null);
                      refreshAll();
                    }}
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col gap-1 text-[12px] text-muted">
                      <span>名称</span>
                      <input
                        className="w-full rounded-md border border-border bg-panel-2 px-2 py-1.5 text-[13px] text-text"
                        value={selectedPart.name}
                        onChange={(e) => {
                          selectedPart.name = e.target.value;
                          bump();
                        }}
                      />
                    </label>
                    <Vec3Field
                      title="位置 Position"
                      value={selectedPart.position}
                      onChange={(v) => {
                        selectedPart.position = v;
                        refresh();
                      }}
                    />
                    <Vec3Field
                      title="旋转 Rotation (rad)"
                      value={selectedPart.rotation}
                      onChange={(v) => {
                        selectedPart.rotation = v;
                        refresh();
                      }}
                    />
                    <ScaleField
                      value={selectedPart.scale}
                      onChange={(v) => {
                        selectedPart.scale = v;
                        refresh();
                      }}
                    />
                    <button
                      className={BTN_SM_DANGER + ' w-full justify-center'}
                      onClick={() => {
                        removePart(assetRef.current.root, selectedPart.id);
                        selectPart(null);
                        refreshAll();
                      }}
                    >
                      删除此部件
                    </button>
                  </div>
                )
              ) : (
                <p className="text-sm text-muted">在视图或骨架中选中一个节点以编辑其变换与材质。</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function PartNode({
  part,
  isRoot,
  selectedId,
  onSelect,
  onDelete,
}: {
  part: AssetPart;
  isRoot?: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={isRoot ? 'root-node' : ''}>
      <div
        className={
          'flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 text-[13px] ' +
          (selectedId === part.id ? 'bg-accent text-[#06140a]' : 'text-text hover:bg-panel-2')
        }
        onClick={() => onSelect(part.id)}
      >
        <span className={'h-2 w-2 shrink-0 rounded-full ' + shapeColor(part.shape)} />
        <span className="truncate">{part.name}</span>
        <span className="ml-auto text-[11px] text-muted">{part.shape}</span>
        {part.shape === 'instance' && <span title="实例引用（整体锁定）">🔒</span>}
        <button
          className="rounded border-none bg-transparent px-1 text-[14px] leading-none text-danger hover:bg-danger hover:text-white"
          title="删除"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(part.id);
          }}
        >
          ×
        </button>
      </div>
      {part.children.length > 0 && (
        <div className="ml-3 border-l border-border pl-1.5">
          {part.children.map((c) => (
            <PartNode key={c.id} part={c} selectedId={selectedId} onSelect={onSelect} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function shapeColor(shape: string): string {
  switch (shape) {
    case 'box':
      return 'bg-[#cccccc]';
    case 'sphere':
      return 'bg-[#4caf50]';
    case 'cylinder':
      return 'bg-[#4f8cff]';
    case 'cone':
      return 'bg-[#f0a020]';
    case 'plane':
      return 'bg-[#b06fd6]';
    case 'node':
      return 'bg-[#e5484d]';
    default:
      return 'bg-accent';
  }
}

function InstanceForm({
  part,
  onName,
  onOpen,
  onDelete,
}: {
  part: AssetPart;
  onName: (n: string) => void;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-border p-2.5">
      <div className="text-[12px] font-semibold text-accent">实例引用 Instance</div>
      <p className="text-[12px] text-muted">该部件整体引用了另一个元件，内部细节不可在此编辑。</p>
      <label className="flex flex-col gap-1 text-[12px] text-muted">
        <span>名称</span>
        <input
          className="w-full rounded-md border border-border bg-panel-2 px-2 py-1.5 text-[13px] text-text"
          value={part.name}
          onChange={(e) => onName(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-[12px] text-muted">
        <span>引用 ID</span>
        <input
          className="w-full rounded-md border border-border bg-panel-2 px-2 py-1.5 text-[13px] text-text"
          value={part.refId ?? ''}
          readOnly
        />
      </label>
      <button className={BTN_SM_FULL} onClick={onOpen}>
        打开原件编辑器 →
      </button>
      <button className={BTN_SM_DANGER + ' w-full justify-center'} onClick={onDelete}>
        删除此引用
      </button>
    </div>
  );
}
