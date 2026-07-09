import { useEffect, useRef } from 'react';

type Dispose = () => void;

// Mounts a vanilla canvas renderer into a host <div> that React owns, and
// disposes its WebGL viewport on unmount (race-safe: if the route unmounts
// before the async renderer finishes, the captured disposer runs immediately
// once it becomes available). `key` controls when the effect re-runs.
export function useCanvasView(
  render: (host: HTMLElement) => void | Promise<void>,
  key?: unknown,
): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let unmounted = false;
    let dispose: Dispose | undefined;
    const capture = () => {
      dispose = (host as HTMLElement & { __dispose?: Dispose }).__dispose;
      if (unmounted) dispose?.();
    };
    const result = render(host);
    if (result && typeof (result as Promise<void>).then === 'function') {
      (result as Promise<void>).then(capture);
    } else {
      capture();
    }
    return () => {
      unmounted = true;
      dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return ref;
}
