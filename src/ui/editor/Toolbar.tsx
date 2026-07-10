import { useState } from 'react';
import { useEditor } from '../../lib/editor-hooks';
import { TransformModes } from './TransformModes';

const PRIMITIVES = ['box', 'sphere', 'cylinder', 'cone', 'plane', 'node'] as const;

/**
 * Editor toolbar (React + Tailwind): add primitives, insert an instance
 * reference (searchable), switch the gizmo transform mode, and capture a
 * thumbnail. Every control dispatches an action on the singleton store, which
 * forwards the change to the canvas viewport.
 */
export function Toolbar() {
  const addPrimitive = useEditor((s) => s.addPrimitive);
  const insertReference = useEditor((s) => s.insertReference);
  const captureShot = useEditor((s) => s.captureShot);
  const refAssets = useEditor((s) => s.refAssets);

  const [query, setQuery] = useState('');
  const [selectedRefId, setSelectedRefId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const matches = refAssets
    .filter((a) => !q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
    .slice(0, 8);

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-panel-2 px-3.5 py-2">
      <span className="text-xs text-muted">基础形状：</span>
      {PRIMITIVES.map((s) => (
        <button key={s} className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={() => addPrimitive(s)}>
          {s === 'node' ? 'Node 节点' : s[0].toUpperCase() + s.slice(1)}
        </button>
      ))}

      <span className="text-xs text-muted">引用：</span>
      <div className="relative inline-block">
        <input
          className="w-[180px] rounded-md border border-border bg-panel px-2.5 py-1 text-[13px] text-text"
          placeholder="搜索元件…"
          autoComplete="off"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSelectedRefId(null);
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const first = matches[0];
              if (first) {
                setSelectedRefId(first.id);
                setQuery(first.name);
                setOpen(false);
              }
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        />
        {open && (
          <div className="absolute left-0 top-[calc(100%+4px)] z-20 max-h-[260px] min-w-[220px] overflow-auto rounded-lg border border-border bg-panel shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            {matches.length === 0 ? (
              <div className="p-2 text-[13px] text-muted">无匹配元件</div>
            ) : (
              matches.map((a) => (
                <div
                  key={a.id}
                  className={
                    'cursor-pointer border-b border-border px-2 py-1 text-[13px] last:border-b-0 hover:bg-accent hover:text-[#06140a]' +
                    (a.id === selectedRefId ? ' bg-accent text-[#06140a]' : '')
                  }
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSelectedRefId(a.id);
                    setQuery(a.name);
                    setOpen(false);
                  }}
                >
                  {a.name} · {a.category}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <button
        className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent"
        onClick={() => {
          if (selectedRefId) insertReference(selectedRefId);
        }}
      >
        插入引用
      </button>

      <TransformModes />
      <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={() => void captureShot()}>
        📷 截图
      </button>
    </div>
  );
}
