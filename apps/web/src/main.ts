import './style.css';
import { renderHome } from './views/home.ts';
import { renderLibrary } from './views/library.ts';
import { renderEditor } from './views/editor.ts';
import { renderSettings } from './views/settings.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;

function route() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/').filter(Boolean);
  app.innerHTML = '';

  if (parts.length === 0) {
    renderHome(app);
  } else if (parts[0] === 'library') {
    renderLibrary(app);
  } else if (parts[0] === 'editor') {
    const id = parts[1]; // undefined => new
    renderEditor(app, id);
  } else if (parts[0] === 'settings') {
    renderSettings(app);
  } else {
    renderHome(app);
  }
}

window.addEventListener('hashchange', route);
route();
