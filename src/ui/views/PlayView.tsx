import { useEffect } from 'react';
import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { renderPlay } from '../../views/play';

export function PlayView({ id }: { id?: string }) {
  const ref = useCanvasView(
    (host) => {
      if (id) void renderPlay(host, id);
    },
    id,
  );
  useEffect(() => {
    if (!id) location.hash = '#/record';
  }, [id]);
  return (
    <PageShell active="play">
      <div className="canvas-host" ref={ref} />
    </PageShell>
  );
}
