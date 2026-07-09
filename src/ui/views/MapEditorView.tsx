import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { renderMapEditor } from '../../views/map-editor';

export function MapEditorView({ id }: { id?: string }) {
  const ref = useCanvasView((host) => {
    void renderMapEditor(host, id);
  }, id);
  return (
    <PageShell active="map">
      <div className="canvas-host" ref={ref} />
    </PageShell>
  );
}
