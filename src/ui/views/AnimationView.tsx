import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { renderAnimation } from '../../views/animation';

export function AnimationView({ id }: { id?: string }) {
  const ref = useCanvasView((host) => {
    void renderAnimation(host, id);
  }, id);
  return (
    <PageShell active="animation">
      <div className="canvas-host" ref={ref} />
    </PageShell>
  );
}
