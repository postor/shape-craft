import { useEditor } from '../../lib/editor-hooks';
import type { AssetPart } from '../../schema';

/**
 * Hierarchy panel (React + Tailwind): recursive tree of the part graph. Clicking
 * a row selects the part (store → both React highlight and canvas gizmo);
 * the × button removes the part subtree.
 */
export function HierarchyPanel() {
  const asset = useEditor((s) => s.asset);
  const selectedPartId = useEditor((s) => s.selectedPartId);
  const revision = useEditor((s) => s.revision);
  const selectPart = useEditor((s) => s.selectPart);
  const removePart = useEditor((s) => s.removePart);
  void revision; // re-render on data change

  const SHAPE_DOT: Record<string, string> = {
    box: 'bg-[#9aa7ff]',
    sphere: 'bg-[#ff9a3c]',
    cylinder: 'bg-[#4caf50]',
    cone: 'bg-[#b06bff]',
    plane: 'bg-[#7ec8ff]',
    node: 'bg-[#e0e0e0]',
    instance: 'bg-[#e0e0e0]',
  };

  function partNode(part: AssetPart, isRoot: boolean) {
    const selected = selectedPartId === part.id;
    const isInstance = part.shape === 'instance';
    void isRoot;
    return (
      <div key={part.id}>
        <div
          className={
            'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-[13px] hover:bg-panel-2' +
            (selected ? ' bg-[rgba(76,175,80,0.18)] outline outline-1 outline-accent' : '')
          }
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('row-del')) return;
            selectPart(part.id);
          }}
        >
          <span className={'h-[9px] w-[9px] rounded-[2px] ' + (SHAPE_DOT[part.shape] ?? 'bg-muted')} />
          <span className="flex-1">{part.name}</span>
          <span className="text-[11px] text-muted">{part.shape}</span>
          {isInstance && <span title="实例引用（整体锁定）">🔒</span>}
          <button
            className="ml-1.5 cursor-pointer rounded border-none bg-transparent p-1 text-[16px] leading-none text-muted hover:bg-danger hover:text-white"
            title="删除该部件及其子级"
            onClick={(e) => {
              e.stopPropagation();
              removePart(part.id);
            }}
          >
            ×
          </button>
        </div>
        {part.children.length > 0 && (
          <div className="ml-2.5 border-l border-dashed border-border pl-4">
            {part.children.map((c) => partNode(c, false))}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="flex flex-col overflow-auto border-r border-border bg-panel">
      <h4 className="px-3.5 pb-2 pt-3.5 text-[13px] uppercase tracking-[0.5px] text-muted">层级结构</h4>
      <div className="p-2">{asset ? partNode(asset.root, true) : null}</div>
    </aside>
  );
}
