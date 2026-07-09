import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { renderEditor } from '../../views/editor';

export function EditorView({ id }: { id?: string }) {
  const ref = useCanvasView((host) => {
    void renderEditor(host, id);
  }, id);
  return (
    <PageShell active="library">
      <div className="canvas-host" ref={ref} />
    </PageShell>
  );
}
