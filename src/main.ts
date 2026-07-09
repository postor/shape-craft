import './style.css';
import { mountApp } from './ui/mount';
import { maybeRunSelfTests } from './lib/selftest.ts';
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

// ---- Mount the React application (owns routing + rendering) ----
mountApp(app);

// Run parameter-controlled self-tests (?test=schema|api|all) when present.
maybeRunSelfTests();

// Register the service worker for offline support + update prompts.
setupPWAUpdate();
