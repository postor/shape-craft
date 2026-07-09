import { useCallback, useEffect, useState } from 'react';
import * as assetApi from '../api';
import * as sceneApi from '../scene-api';
import * as animApi from '../anim-api';
import * as mapApi from '../map-api';
import * as recordApi from '../record-api';
import { loadSettings, saveSettings, isLocalMode, setLocalMode, type OpenAISettings } from '../settings';
import type { AssetComponent, AssetInput } from '../../schema';
import type { SceneComponent, SceneInput } from '../../schema/scene';
import type { AnimComponent, AnimInput } from '../../schema/animation';
import type { MapComponent, MapInput } from '../../schema/map';
import type { RecordSession, RecordInput } from '../../schema/record';

type Listener = () => void;

// Generic list hook: holds items, reloads on mount and whenever the
// collection's subscribe() fires (no payload — re-query the whole list).
function useList<T>(subscribe: (fn: Listener) => () => void, list: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(() => {
    let active = true;
    setLoading(true);
    list()
      .then((d) => active && setItems(d))
      .catch((e) => active && setError(e as Error))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [list]);

  useEffect(() => {
    const cancel = reload();
    const unsub = subscribe(reload);
    return () => {
      cancel();
      unsub();
    };
  }, [subscribe, reload]);

  return { items, loading, error, reload };
}

// Generic single-item hook keyed by id, reloading on id change + subscribe.
function useItem<T>(
  subscribe: (fn: Listener) => () => void,
  get: (id: string) => Promise<T | null>,
  id: string | undefined,
) {
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(() => {
    if (!id) {
      setItem(null);
      setLoading(false);
      return () => {};
    }
    let active = true;
    setLoading(true);
    get(id)
      .then((d) => active && setItem(d))
      .catch((e) => active && setError(e as Error))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [get, id]);

  useEffect(() => {
    const cancel = reload();
    const unsub = subscribe(reload);
    return () => {
      cancel();
      unsub();
    };
  }, [subscribe, reload]);

  return { item, loading, error, reload };
}

// ---- Assets ----
export function useAssets() {
  const { items, loading, error, reload } = useList(assetApi.subscribe, assetApi.listAssets);
  return { assets: items, loading, error, reload };
}

export function useAsset(id: string | undefined) {
  return useItem(assetApi.subscribe, assetApi.getAsset, id);
}

export const assetMutations = {
  create: assetApi.createAsset,
  update: assetApi.updateAsset,
  remove: assetApi.deleteAsset,
  duplicate: assetApi.duplicateAsset,
  rename: assetApi.renameAsset,
};
// Convenience hooks mirroring the contract's named mutation hooks. Each simply
// exposes the underlying api function; list views re-sync via useAssets' subscription.
export function useCreateAsset() {
  return assetApi.createAsset;
}
export function useUpdateAsset() {
  return assetApi.updateAsset;
}
export function useDeleteAsset() {
  return assetApi.deleteAsset;
}
export type { AssetComponent, AssetInput };

// ---- Scenes ----
export function useScenes() {
  const { items, loading, error, reload } = useList(sceneApi.subscribeScenes, sceneApi.listScenes);
  return { scenes: items, loading, error, reload };
}

export function useScene(id: string | undefined) {
  return useItem(sceneApi.subscribeScenes, sceneApi.getScene, id);
}

export const sceneMutations = {
  create: sceneApi.createScene,
  update: sceneApi.updateScene,
  remove: sceneApi.deleteScene,
};
export type { SceneComponent, SceneInput };

// ---- Animations ----
export function useAnimations() {
  const { items, loading, error, reload } = useList(animApi.subscribeAnimations, animApi.listAnimations);
  return { animations: items, loading, error, reload };
}

export function useAnimationsByScene(sceneId: string | undefined) {
  const [items, setItems] = useState<AnimComponent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!sceneId) {
      setItems([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    animApi.listAnimationsByScene(sceneId).then((d) => active && setItems(d)).finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [sceneId]);
  return { animations: items, loading };
}

export function useAnimation(id: string | undefined) {
  return useItem(animApi.subscribeAnimations, animApi.getAnimation, id);
}

export const animMutations = {
  create: animApi.createAnimation,
  update: animApi.updateAnimation,
  remove: animApi.deleteAnimation,
};
export type { AnimComponent, AnimInput };

// ---- Maps ----
export function useMaps() {
  const { items, loading, error, reload } = useList(mapApi.subscribeMaps, mapApi.listMaps);
  return { maps: items, loading, error, reload };
}

export function useMap(id: string | undefined) {
  return useItem(mapApi.subscribeMaps, mapApi.getMap, id);
}

export const mapMutations = {
  create: mapApi.createMap,
  update: mapApi.updateMap,
  remove: mapApi.deleteMap,
  duplicate: mapApi.duplicateMap,
  rename: mapApi.renameMap,
};
export type { MapComponent, MapInput };

// ---- Records ----
export function useRecords() {
  const { items, loading, error, reload } = useList(recordApi.subscribeRecords, recordApi.listRecords);
  return { records: items, loading, error, reload };
}

export function useRecord(id: string | undefined) {
  return useItem(recordApi.subscribeRecords, recordApi.getRecord, id);
}

export const recordMutations = {
  create: recordApi.createRecord,
  update: recordApi.updateRecord,
  remove: recordApi.deleteRecord,
};
export type { RecordSession, RecordInput };

// ---- Settings (no subscribe mechanism; manage local state) ----
export function useSettings() {
  const [settings, setSettings] = useState<OpenAISettings>(() => loadSettings());
  const [localMode, setLocalModeState] = useState<boolean>(() => isLocalMode());

  const update = useCallback((next: OpenAISettings) => {
    saveSettings(next);
    setSettings(next);
  }, []);

  const setMode = useCallback((local: boolean) => {
    setLocalMode(local);
    setLocalModeState(local);
  }, []);

  return { settings, localMode, update, setMode };
}
