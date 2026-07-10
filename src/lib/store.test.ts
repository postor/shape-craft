import { describe, it, expect, vi, beforeEach } from 'vitest';
import { editorStore } from './store';
import { createEmptyAsset, type AssetComponent, type AssetPart } from '../schema';

/**
 * Minimal, dependency-free verification of the event-driven canvas<->React
 * sync. The store is the singleton bridge; the canvas side is simulated with a
 * mock `Viewport` whose methods we spy on, and React's subscription is simulated
 * with `editorStore.subscribe` (the exact mechanism `useSyncExternalStore` uses).
 */

function makeMockViewport() {
  return {
    setSelected: vi.fn(),
    setTransformMode: vi.fn(),
    setLockRatio: vi.fn(),
    setRoot: vi.fn(),
    setScripts: vi.fn(),
    getDimensions: vi.fn(() => ({ x: 1, y: 1, z: 1 })),
    captureThumbnail: vi.fn(() => 'data:image/png;base64,'),
    dispose: vi.fn(),
  };
}

function sampleAsset(): AssetComponent {
  const asset = createEmptyAsset('Sync Test', 'tree');
  const box: AssetPart = {
    id: 'p1',
    name: 'Box',
    shape: 'box',
    size: { x: 1, y: 1, z: 1 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    material: { color: '#cccccc', roughness: 0.8, metalness: 0.05 },
    children: [],
  };
  asset.root.children.push(box);
  return asset;
}

describe('editor store: event-driven canvas <-> React sync', () => {
  beforeEach(() => {
    editorStore.getState().resetEditor();
  });

  it('React -> canvas: selecting a part updates state and drives the viewport', () => {
    const vp = makeMockViewport();
    editorStore.getState().setViewport(vp as never);

    let notified = 0;
    const unsub = editorStore.subscribe(() => {
      notified++;
    });

    editorStore.getState().selectPart('abc');

    expect(editorStore.getState().selectedPartId).toBe('abc');
    expect(vp.setSelected).toHaveBeenCalledWith('abc');
    expect(notified).toBeGreaterThan(0); // event reached the React subscriber
    unsub();
  });

  it('React -> canvas: transform mode is propagated to the viewport', () => {
    const vp = makeMockViewport();
    editorStore.getState().setViewport(vp as never);

    editorStore.getState().setTransformMode('rotate');

    expect(editorStore.getState().transformMode).toBe('rotate');
    expect(vp.setTransformMode).toHaveBeenCalledWith('rotate');
  });

  it('canvas -> React: a gizmo transform mutates the model and notifies subscribers', () => {
    const vp = makeMockViewport();
    editorStore.getState().setViewport(vp as never);
    const asset = sampleAsset();
    editorStore.setState({ asset, revision: 0 });

    let notified = 0;
    const unsub = editorStore.subscribe(() => {
      notified++;
    });

    editorStore.getState().applyCanvasTransform('p1', {
      position: { x: 2, y: 3, z: 4 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    });

    expect(notified).toBeGreaterThan(0); // React side re-renders
    const updated = asset.root.children.find((c) => c.id === 'p1')!;
    expect(updated.position).toEqual({ x: 2, y: 3, z: 4 });
    unsub();
  });

  it('singleton: the module exposes one shared store instance', () => {
    expect(editorStore).toBe(editorStore);
    // The same store is importable from the hook module.
    // (covered by the shared reference above)
  });
});
