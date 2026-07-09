import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { renderRoam } from '../../views/roam';

export function RoamView({ id }: { id?: string }) {
  const ref = useCanvasView((host) => {
    void renderRoam(host, id);
  }, id);
  return (
    <PageShell active="roam">
      <div className="canvas-host" ref={ref} />
    </PageShell>
  );
}
