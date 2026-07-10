import { useEditor } from '../../lib/editor-hooks';
import { findPart } from '../../lib/instance';
import type { AssetPart } from '../../schema';
import { NumberField, Vec3Field, ScaleField, ScriptList } from './fields';

const SHAPES = ['box', 'sphere', 'cylinder', 'cone', 'plane', 'triangle', 'node'] as const;

/**
 * Inspector panel (React + Tailwind): edits the selected part's transform,
 * material, and scripts. Every edit calls `updatePart`, which mutates the model
 * and triggers a 3D scene rebuild — so the canvas viewport reflects the change
 * immediately (React → canvas direction of the sync).
 */
export function InspectorPanel() {
  const asset = useEditor((s) => s.asset);
  const selectedPartId = useEditor((s) => s.selectedPartId);
  const revision = useEditor((s) => s.revision);
  const updatePart = useEditor((s) => s.updatePart);
  const removePart = useEditor((s) => s.removePart);
  const addScript = useEditor((s) => s.addScript);
  const updateScript = useEditor((s) => s.updateScript);
  const removeScript = useEditor((s) => s.removeScript);
  const applyScripts = useEditor((s) => s.applyScripts);
  void revision; // re-render on data change

  if (!asset || !selectedPartId) {
    return (
      <>
        <h4 className="px-3.5 pb-2 pt-3.5 text-[13px] uppercase tracking-[0.5px] text-muted">属性</h4>
        <div className="p-3">
          <p className="text-sm text-muted">在视图或层级中选中一个部件以编辑其变换与材质。</p>
        </div>
      </>
    );
  }

  const part = findPart(asset.root, selectedPartId);
  if (!part) {
    return (
      <>
        <h4 className="px-3.5 pb-2 pt-3.5 text-[13px] uppercase tracking-[0.5px] text-muted">属性</h4>
        <div className="p-3">
          <p className="text-sm text-muted">在视图或层级中选中一个部件以编辑其变换与材质。</p>
        </div>
      </>
    );
  }

  if (part.shape === 'instance') {
    return (
      <>
        <h4 className="px-3.5 pb-2 pt-3.5 text-[13px] uppercase tracking-[0.5px] text-muted">属性</h4>
        <div className="p-3">
          <div className="flex flex-col gap-2 rounded-lg border border-border p-2.5">
            <div className="text-[12px] font-semibold text-accent">实例引用 Instance</div>
            <p className="text-sm text-muted">该部件整体引用了另一个元件，内部细节不可在此编辑。</p>
            <label className="flex flex-col gap-1 text-[12px] text-muted">
              <span>名称</span>
            </label>
            <input
              className="rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
              type="text"
              value={part.name}
              onChange={(e) => updatePart(part.id, (p) => (p.name = e.target.value))}
            />
            <label className="flex flex-col gap-1 text-[12px] text-muted">
              <span>引用 ID</span>
            </label>
            <input
              className="rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
              type="text"
              value={part.refId ?? ''}
              readOnly
            />
          </div>
          <a
            className="mt-2 flex w-full justify-center border border-border bg-panel-2 px-3.5 py-2 text-[13px] text-text transition-colors hover:border-accent"
            href={`#/editor/${part.refId}`}
          >
            打开原件编辑器 →
          </a>
          <button
            className="mt-2 flex w-full justify-center border border-danger bg-transparent px-3.5 py-2 text-[13px] text-danger transition-colors hover:border-danger"
            onClick={() => removePart(part.id)}
          >
            删除此引用
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h4 className="px-3.5 pb-2 pt-3.5 text-[13px] uppercase tracking-[0.5px] text-muted">属性</h4>
      <div className="p-3">
        <label className="flex flex-col gap-1 text-[12px] text-muted">
          <span>名称</span>
          <input
            className="rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
            type="text"
            value={part.name}
            onChange={(e) => updatePart(part.id, (p) => (p.name = e.target.value))}
          />
        </label>

        <label className="mt-2 flex flex-col gap-1 text-[12px] text-muted">
          <span>形状</span>
          <select
            className="rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
            value={part.shape}
            onChange={(e) =>
              updatePart(part.id, (p) => (p.shape = e.target.value as AssetPart['shape']))
            }
          >
            {SHAPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-2">
          <Vec3Field
            title="尺寸 Size"
            value={part.size}
            onChange={(v) => updatePart(part.id, (p) => (p.size = v))}
          />
        </div>
        <div className="mt-2">
          <Vec3Field
            title="位置 Position"
            value={part.position}
            onChange={(v) => updatePart(part.id, (p) => (p.position = v))}
          />
        </div>
        <div className="mt-2">
          <Vec3Field
            title="旋转 Rotation (rad)"
            value={part.rotation}
            onChange={(v) => updatePart(part.id, (p) => (p.rotation = v))}
          />
        </div>
        <div className="mt-2">
          <ScaleField value={part.scale} onChange={(v) => updatePart(part.id, (p) => (p.scale = v))} />
        </div>

        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-border p-2.5">
          <div className="text-[12px] font-semibold text-accent">材质 Material</div>
          <label className="flex flex-col gap-1 text-[12px] text-muted">
            <span>颜色</span>
            <input
              type="color"
              value={part.material.color}
              onChange={(e) => updatePart(part.id, (p) => (p.material.color = e.target.value))}
            />
          </label>
          <NumberField
            label="Roughness"
            value={part.material.roughness}
            onChange={(v) =>
              updatePart(part.id, (p) => (p.material.roughness = Math.max(0, Math.min(1, v))))
            }
          />
          <NumberField
            label="Metalness"
            value={part.material.metalness}
            onChange={(v) =>
              updatePart(part.id, (p) => (p.material.metalness = Math.max(0, Math.min(1, v))))
            }
          />
        </div>

        <button
          className="mt-2 flex w-full justify-center border border-danger bg-transparent px-3.5 py-2 text-[13px] text-danger transition-colors hover:border-danger"
          onClick={() => removePart(part.id)}
        >
          删除此部件
        </button>

        <ScriptList
          scripts={asset.scripts ?? []}
          partId={part.id}
          onAdd={addScript}
          onUpdate={updateScript}
          onRemove={removeScript}
          onApply={applyScripts}
        />
      </div>
    </>
  );
}
