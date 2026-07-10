import { editorStore } from '../lib/store';
import { Viewport } from '../lib/three-view.ts';
import { createDimensionOverlay } from '../lib/ruler.ts';

/**
 * Canvas mount for the asset editor.
 *
 * This function owns ONLY the Three.js viewport. It is invoked by React via
 * `useCanvasView` with the host <div> that React owns. All editor *state* lives
 * in the singleton `editorStore`; the `Viewport` reports user interaction back
 * through the `onSelect` / `onTransform` callbacks, which we forward straight to
 * the store. The store then drives both React (re-render) and the canvas
 * (e.g. `viewport.setSelected`) — that is the bidirectional event sync.
 *
 * The non-canvas UI (toolbar, hierarchy, inspector, chat, top bar) is rendered
 * by React components in `src/ui/editor/*` and reads/writes the same store.
 */
export async function renderEditor(root: HTMLElement, id?: string): Promise<void> {
  const viewport = new Viewport(
    root,
    (pid) => editorStore.getState().selectPart(pid),
    (pid, t) => editorStore.getState().applyCanvasTransform(pid, t),
  );
  editorStore.getState().setViewport(viewport);

  const updateDimensions = createDimensionOverlay(root);
  editorStore.getState().setDimensionUpdater(updateDimensions);

  await editorStore.getState().loadAsset(id);

  (root as HTMLElement & { __dispose?: () => void }).__dispose = () => {
    try {
      viewport.dispose();
    } catch {
      /* already torn down */
    }
    editorStore.getState().resetEditor();
  };

  // ---- test hook: `?ref` auto-fetches the list and inserts the first reference ----
  if (new URLSearchParams(location.hash.split('?')[1] || '').has('ref')) {
    const refAssets = editorStore.getState().refAssets;
    if (refAssets.length) {
      editorStore.getState().insertReference(refAssets[0].id);
    }
  }
}
