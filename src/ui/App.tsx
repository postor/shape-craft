import { lazy, Suspense, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { SettingsView } from './views/SettingsView';
import { MapLibraryView } from './views/MapLibraryView';
import { RecordListView } from './views/RecordListView';
import { DemoView } from './views/DemoView';
import { SceneLibraryView } from './views/SceneLibraryView';
import { Spinner } from './components';

// Canvas (Three.js) views are code-split so the heavy 3D runtime stays out of
// the initial bundle and is only fetched when a canvas route is opened.
const EditorView = lazy(() => import('./views/EditorView').then((m) => ({ default: m.EditorView })));
const CharactersView = lazy(() => import('./views/CharactersView').then((m) => ({ default: m.CharactersView })));
const SceneView = lazy(() => import('./views/SceneView').then((m) => ({ default: m.SceneView })));
const AnimationView = lazy(() => import('./views/AnimationView').then((m) => ({ default: m.AnimationView })));
const RoamView = lazy(() => import('./views/RoamView').then((m) => ({ default: m.RoamView })));
const PlayView = lazy(() => import('./views/PlayView').then((m) => ({ default: m.PlayView })));
const MapEditorView = lazy(() => import('./views/MapEditorView').then((m) => ({ default: m.MapEditorView })));

function useHash(): string {
  const [hash, setHash] = useState(() => location.hash || '#/');
  useEffect(() => {
    const on = () => setHash(location.hash || '#/');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

export function App(): ReactElement {
  const hash = useHash();
  const path = hash.split('?')[0];
  const parts = path.replace(/^#\//, '').split('/').filter(Boolean);
  const key = parts[0] ?? '';

  let view: ReactElement;
  switch (key) {
    case '':
      view = <HomeView />;
      break;
    case 'library':
      view = <LibraryView />;
      break;
    case 'editor':
      view = <EditorView id={parts[1]} />;
      break;
    case 'characters':
      view = <CharactersView type={parts[1]} id={parts[2]} />;
      break;
    case 'scenes':
      view = parts[1] ? <SceneView id={parts[1]} /> : <SceneLibraryView />;
      break;
    case 'roam':
      view = <RoamView id={parts[1]} />;
      break;
    case 'animations':
      view = <AnimationView id={parts[1]} />;
      break;
    case 'record':
      view = parts[1] ? <PlayView id={parts[1]} /> : <RecordListView />;
      break;
    case 'demo':
      view = <DemoView />;
      break;
    case 'settings':
      view = <SettingsView />;
      break;
    case 'map':
      view = parts[1] ? <MapEditorView id={parts[1]} /> : <MapLibraryView />;
      break;
    case 'maps':
      view = <MapLibraryView />;
      break;
    default:
      view = <HomeView />;
  }

  return <Suspense fallback={<Spinner label="加载中…" />}>{view}</Suspense>;
}
