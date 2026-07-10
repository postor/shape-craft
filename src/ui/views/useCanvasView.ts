import { useEffect, useRef } from 'react';

type Dispose = () => void;

interface CanvasInstance {
  dispose?: Dispose;
}

// Mounts a vanilla canvas renderer into a host <div> that React owns, exposes
// the created instance through `instance` so React can drive it (setScene,
// setMode, startRecording, …), and disposes its WebGL viewport on unmount
// (race-safe: if the route unmounts before the async renderer finishes, the
// captured disposer runs immediately once it becomes available). `key`
// controls when the effect re-runs.
export function useCanvasView<T extends CanvasInstance>(
  create: (host: HTMLElement) => T | Promise<T>,
  key?: unknown,
): { ref: React.RefObject<HTMLDivElement | null>; instance: React.MutableRefObject<T | null> } {
  const ref = useRef<HTMLDivElement>(null);
  const instance = useRef<T | null>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let unmounted = false;
    let dispose: Dispose | undefined;
    const capture = (v: T) => {
      instance.current = v;
      dispose = (v as CanvasInstance).dispose;
      if (unmounted) dispose?.();
    };
    const result = create(host);
    if (result && typeof (result as Promise<T>).then === 'function') {
      (result as Promise<T>).then(capture);
    } else {
      capture(result as T);
    }
    return () => {
      unmounted = true;
      dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return { ref, instance };
}
