import { PageShell } from '../components';
import { useCanvasView } from './useCanvasView';
import { renderCharacters } from '../../views/characters';

export function CharactersView({ type, id }: { type?: string; id?: string }) {
  const ref = useCanvasView(
    (host) => {
      void renderCharacters(host, type, id);
    },
    `${type}|${id}`,
  );
  return (
    <PageShell active="characters">
      <div className="canvas-host" ref={ref} />
    </PageShell>
  );
}
