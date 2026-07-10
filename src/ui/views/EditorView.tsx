import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { renderEditor } from '../../views/editor';
import { TopBar } from '../editor/TopBar';
import { Toolbar } from '../editor/Toolbar';
import { HierarchyPanel } from '../editor/HierarchyPanel';
import { InspectorPanel } from '../editor/InspectorPanel';
import { ChatPanel } from '../editor/ChatPanel';

/**
 * Asset editor route (React + Tailwind).
 *
 * Layout: a top bar, then a 3-column grid:
 *   [ hierarchy (React) ] [ toolbar + canvas viewport (Three.js) ] [ inspector + chat (React) ]
 *
 * The canvas is the ONLY imperative element: React owns the host <div> and
 * `useCanvasView` mounts the vanilla `Viewport` into it. Everything else is a
 * React component that reads/writes the singleton `editorStore`, which is the
 * event-driven bridge to the canvas.
 */
export function EditorView({ id }: { id?: string }) {
  const { ref } = useCanvasView((host) => {
    void renderEditor(host, id);
    return { dispose: () => (host as HTMLElement & { __dispose?: () => void }).__dispose?.() };
  }, id);

  return (
    <PageShell active="library">
      <div className="flex h-screen flex-col overflow-hidden">
        <TopBar />
        <div className="grid min-h-0 flex-1 grid-cols-[240px_1fr_340px]">
          <HierarchyPanel />
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <Toolbar />
            <div ref={ref} className="relative min-h-0 flex-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />
          </div>
          <aside className="flex min-h-0 flex-col overflow-hidden border-l border-border bg-panel">
            <div className="min-h-0 flex-1 overflow-auto">
              <InspectorPanel />
            </div>
            <div className="border-t border-border">
              <ChatPanel />
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
