import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { renderAnimation } from '../../views/animation';

export function AnimationView({ id }: { id?: string }) {
  const { ref } = useCanvasView((host) => {
    void renderAnimation(host, id);
    return { dispose: () => (host as HTMLElement & { __dispose?: () => void }).__dispose?.() };
  }, id);
  return (
    <PageShell active="animation">
      <div className="relative min-h-0 flex-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" ref={ref} />
    </PageShell>
  );
}
