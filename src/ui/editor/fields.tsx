import { useRef, useState } from 'react';
import type { Vec3Like } from '../../lib/transform-ui';
import type { ScriptSlot } from '../../schema';

export function NumberField({
  label,
  value,
  step = 0.1,
  onChange,
  full,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (v: number) => void;
  full?: boolean;
}) {
  return (
    <label className={'flex flex-col gap-1 text-[12px] text-muted' + (full ? ' col-span-full' : '')}>
      <span>{label}</span>
      <input
        className="w-full rounded-md border border-border bg-panel-2 px-2 py-1.5 text-[13px] text-text"
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </label>
  );
}

export function Vec3Field({
  title,
  value,
  onChange,
}: {
  title: string;
  value: Vec3Like;
  onChange: (v: Vec3Like) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-2.5">
      <div className="text-[12px] font-semibold text-accent">{title}</div>
      <div className="grid grid-cols-3 gap-1.5">
        {(['x', 'y', 'z'] as const).map((axis) => (
          <NumberField
            key={axis}
            label={axis.toUpperCase()}
            value={value[axis]}
            onChange={(v) => onChange({ ...value, [axis]: v })}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Scale editor with an optional "lock aspect ratio" toggle (on by default),
 * mirroring the behaviour of the old imperative `scaleGroup`.
 */
export function ScaleField({
  value,
  onChange,
}: {
  value: Vec3Like;
  onChange: (v: Vec3Like) => void;
}) {
  const [lock, setLock] = useState(true);
  const prevRef = useRef<Vec3Like>(value);

  const handle = (axis: 'x' | 'y' | 'z', val: number) => {
    const p = prevRef.current;
    let next: Vec3Like;
    if (lock) {
      if (p[axis] !== 0) {
        const factor = val / p[axis];
        next = { x: p.x * factor, y: p.y * factor, z: p.z * factor };
      } else {
        next = { x: val, y: val, z: val };
      }
    } else {
      next = { ...p, [axis]: val };
    }
    prevRef.current = next;
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-2.5">
      <div className="text-[12px] font-semibold text-accent">缩放 Scale</div>
      <label className="flex flex-row items-center gap-2 text-[12px] text-muted">
        <span>锁定比例 Lock ratio</span>
        <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} />
      </label>
      <div className="grid grid-cols-3 gap-1.5">
        {(['x', 'y', 'z'] as const).map((axis) => (
          <NumberField
            key={axis}
            label={axis.toUpperCase()}
            value={value[axis]}
            onChange={(v) => handle(axis, v)}
          />
        ))}
      </div>
    </div>
  );
}

/** Per-part custom script slots (Unity-style update(t, dt)). */
export function ScriptList({
  scripts,
  partId,
  onAdd,
  onUpdate,
  onRemove,
  onApply,
}: {
  scripts: ScriptSlot[];
  partId: string;
  onAdd: (partId: string) => void;
  onUpdate: (slotId: string, code: string, name: string) => void;
  onRemove: (slotId: string) => void;
  onApply: () => void;
}) {
  const slots = scripts.filter((s) => s.partId === partId);
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-2.5">
      <div className="text-[12px] font-semibold text-accent">脚本 Scripts（Unity 式 update）</div>
      <div className="flex flex-col gap-2.5">
        {slots.map((s) => (
          <div key={s.id} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <input
                className="flex-1 rounded border border-border bg-panel-2 px-2 py-1 text-[13px] text-text"
                defaultValue={s.name}
                onChange={(e) => onUpdate(s.id, s.code, e.target.value)}
              />
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 border border-accent bg-accent px-2 py-0.5 text-[11px] font-semibold text-[#06140a] transition-colors hover:border-accent"
                onClick={onApply}
              >
                应用
              </button>
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2 py-0.5 text-[11px] text-danger transition-colors hover:border-danger"
                onClick={() => onRemove(s.id)}
              >
                删除
              </button>
            </div>
            <textarea
              className="min-h-[120px] w-full rounded border border-border bg-panel-2 px-2 py-1 font-mono text-[12px] text-text"
              defaultValue={s.code}
              spellCheck={false}
              onChange={(e) => onUpdate(s.id, e.target.value, s.name)}
            />
          </div>
        ))}
      </div>
      <button
        className="flex w-full justify-center border border-border bg-panel-2 px-3.5 py-2 text-[13px] text-text transition-colors hover:border-accent"
        onClick={() => onAdd(partId)}
      >
        + 添加脚本
      </button>
    </div>
  );
}
