import { useEditor } from '../../lib/editor-hooks';
import { ASSET_CATEGORIES, type AssetCategory } from '../../schema';

/**
 * Editor top bar (React + Tailwind): back link, name, category, save / delete,
 * and a live save-state readout. All values are read from and written to the
 * singleton editor store — so the canvas side sees the same asset the user edits.
 */
export function TopBar() {
  const asset = useEditor((s) => s.asset);
  const savedId = useEditor((s) => s.savedId);
  const saveState = useEditor((s) => s.saveState);
  const revision = useEditor((s) => s.revision);
  const setName = useEditor((s) => s.setName);
  const setCategory = useEditor((s) => s.setCategory);
  const save = useEditor((s) => s.save);
  const remove = useEditor((s) => s.remove);
  void revision; // re-render on data change

  if (!asset) {
    return (
      <div className="flex items-center gap-2 border-b border-border bg-panel px-3 py-2">
        <a
          className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent"
          href="#/library"
        >
          ← 返回
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 border-b border-border bg-panel px-3 py-2">
      <a
        className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent"
        href="#/library"
      >
        ← 返回
      </a>
      <input
        className="min-w-[220px] rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
        type="text"
        value={asset.name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
        value={asset.category}
        onChange={(e) => setCategory(e.target.value as AssetCategory)}
      >
        {ASSET_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-[#06140a] transition-colors hover:border-accent"
        onClick={() => void save()}
      >
        保存
      </button>
      {savedId && (
        <button
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-danger bg-transparent px-3.5 py-2 text-sm text-danger transition-colors hover:border-danger"
          onClick={() => void remove()}
        >
          删除
        </button>
      )}
      <span className="ml-auto text-xs text-accent">{saveState}</span>
    </div>
  );
}
