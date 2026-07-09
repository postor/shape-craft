import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { renderScene } from '../../views/scene';

export function SceneView({ id }: { id?: string }) {
  const ref = useCanvasView((host) => {
    void renderScene(host, id);
  }, id);
  return (
    <PageShell active="scene">
      <div className="canvas-host" ref={ref} />
    </PageShell>
  );
}
