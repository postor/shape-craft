import './style.css';
import { renderHome } from './views/home.ts';
import { renderLibrary } from './views/library.ts';
import { renderEditor } from './views/editor.ts';
import { renderSettings } from './views/settings.ts';
import { renderCharacters } from './views/characters.ts';
import { renderScene } from './views/scene.ts';
import { renderAnimation } from './views/animation.ts';
import { renderDemo } from './views/demo.ts';
import { maybeRunSelfTests } from './lib/selftest.ts';
import { renderRoam } from './views/roam.ts';
import { setupPWAUpdate } from './lib/pwa.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;

// ---- debug console mirror (collectible via DOM) ----
// Only show the bottom debug window when the URL contains `log=1`
// (works both in the hash query, e.g. `#/editor/1?log=1`, and the real query).
function __debugEnabled() {
  const qs = (location.hash.split('?')[1] || '') + '&' + (location.search.replace(/^\?/, '') || '');
  return /(^|&)log=1(\b|&|$)/.test(qs);
}
const __dbg = document.createElement('div');
__dbg.id = '__console';
Object.assign(__dbg.style, {
  position: 'fixed', bottom: '0', left: '0', right: '0', maxHeight: '40%', overflow: 'auto',
  background: 'rgba(0,0,0,0.82)', color: '#9fe', font: '11px/1.4 monospace',
  padding: '6px 8px', zIndex: '99999', whiteSpace: 'pre-wrap', borderTop: '1px solid #2a2c33',
  display: __debugEnabled() ? 'block' : 'none',
});
document.body.appendChild(__dbg);
function __push(lvl: string, args: unknown[]) {
  if (__dbg.style.display === 'none') return;
  const line = `[${lvl}] ` + args.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' ');
  const span = document.createElement('div');
  span.textContent = line;
  __dbg.appendChild(span);
}
window.addEventListener('error', (e) => __push('error', [e.message, (e as ErrorEvent).filename + ':' + (e as ErrorEvent).lineno]));
window.addEventListener('unhandledrejection', (e) => __push('reject', [String((e as PromiseRejectionEvent).reason)]));
const __olog = console.log.bind(console);
const __owarn = console.warn.bind(console);
const __oerr = console.error.bind(console);
console.log = (...a: unknown[]) => { __push('log', a); __olog(...a); };
console.warn = (...a: unknown[]) => { __push('warn', a); __owarn(...a); };
console.error = (...a: unknown[]) => { __push('error', a); __oerr(...a); };
(window as unknown as { __dbg: HTMLElement }).__dbg = __dbg;

function route() {
  const hash = location.hash || '#/';
  const path = hash.split('?')[0]; // strip query string (e.g. `#/editor?ref=1`)
  const parts = path.replace(/^#\//, '').split('/').filter(Boolean);
  app.innerHTML = '';

  if (parts.length === 0) {
    renderHome(app);
  } else if (parts[0] === 'library') {
    renderLibrary(app);
  } else if (parts[0] === 'editor') {
    const id = parts[1]; // undefined => new
    renderEditor(app, id);
  } else if (parts[0] === 'characters') {
    const type = parts[1]; // optional: humanoid | quadruped | flying
    const id = parts[2]; // optional: existing asset id
    void renderCharacters(app, type, id);
  } else if (parts[0] === 'settings') {
    renderSettings(app);
  } else if (parts[0] === 'scenes') {
    const id = parts[1];
    void renderScene(app, id);
  } else if (parts[0] === 'roam') {
    const id = parts[1];
    void renderRoam(app, id);
  } else if (parts[0] === 'animations') {
    const id = parts[1];
    void renderAnimation(app, id);
  } else if (parts[0] === 'demo') {
    void renderDemo(app);
  } else {
    renderHome(app);
  }

  // Parameter-controlled self-test harness (?test=schema|api|all). Runs
  // regardless of route and prints results to the console (mirrored to the
  // on-page #__console when log=1).
  maybeRunSelfTests();
}

window.addEventListener('hashchange', () => { __dbg.style.display = __debugEnabled() ? 'block' : 'none'; });
window.addEventListener('hashchange', route);
route();

// Register the service worker for offline support + update prompts.
setupPWAUpdate();
