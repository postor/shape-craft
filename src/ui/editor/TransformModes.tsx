import { useEditor } from '../../lib/editor-hooks';

const MODES = ['translate', 'rotate', 'scale'] as const;

/**
 * Transform gizmo controls: the 拖拽 / 旋转 / 缩放 mode buttons plus a
 * default-on "锁定比例" checkbox that keeps the scale gizmo uniform. Extracted
 * so the trio can be reused wherever a viewport gizmo is exposed.
 */
export function TransformModes() {
  const transformMode = useEditor((s) => s.transformMode);
  const setTransformMode = useEditor((s) => s.setTransformMode);
  const lockScaleRatio = useEditor((s) => s.lockScaleRatio);
  const setLockScaleRatio = useEditor((s) => s.setLockScaleRatio);

  return (
    <>
      <span className="text-xs text-muted">变换：</span>
      {MODES.map((m) => (
        <button
          key={m}
          className={
            'inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent' +
            (transformMode === m ? ' bg-accent border-accent text-[#06140a] font-semibold' : '')
          }
          onClick={() => setTransformMode(m)}
        >
          {m === 'translate' ? '拖拽' : m === 'rotate' ? '旋转' : '缩放'}
        </button>
      ))}
      <label className="flex items-center gap-1 text-xs">
        <input
          type="checkbox"
          checked={lockScaleRatio}
          onChange={(e) => setLockScaleRatio(e.target.checked)}
        />
        <span>锁定比例 Lock ratio</span>
      </label>
    </>
  );
}
