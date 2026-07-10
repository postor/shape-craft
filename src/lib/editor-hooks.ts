import { useStore } from 'zustand';
import { editorStore, type EditorState } from './store';

/**
 * Subscribe a React component to a slice of the singleton editor store.
 *
 * `editorStore` is a module-level zustand vanilla store (see `store.ts`). Because
 * we use `useStore` (built on `useSyncExternalStore`) rather than React context,
 * ANY component can read/write the same shared state the canvas viewport uses —
 * and re-render automatically whenever the store emits a change event.
 */
export function useEditor<T>(selector: (s: EditorState) => T): T {
  return useStore(editorStore, selector);
}

export { editorStore };
export type { EditorState };
