import { registerSW } from 'virtual:pwa-register';

interface UpdateBanner {
  el: HTMLDivElement;
  message: HTMLSpanElement;
  refresh: HTMLButtonElement;
  dismiss: HTMLButtonElement;
}

let banner: UpdateBanner | null = null;

function createBanner(): UpdateBanner {
  const style = document.createElement('style');
  style.textContent = `
    #pwa-update {
      position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%);
      z-index: 100000; display: none; align-items: center; gap: 12px;
      background: var(--panel); color: var(--text);
      border: 1px solid var(--border); border-radius: var(--radius);
      box-shadow: var(--shadow); padding: 10px 14px; font-size: 14px;
      max-width: calc(100vw - 32px);
    }
    #pwa-update.show { display: flex; }
    #pwa-update button {
      cursor: pointer; border: none; border-radius: 6px; padding: 6px 12px;
      font-size: 13px; font-weight: 600;
    }
    #pwa-update .refresh { background: var(--accent); color: #fff; }
    #pwa-update .dismiss { background: var(--panel-2); color: var(--muted); }
  `;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.id = 'pwa-update';
  const message = document.createElement('span');
  message.textContent = '有新版本可用 · Update available';
  const refresh = document.createElement('button');
  refresh.className = 'refresh';
  refresh.textContent = '刷新 / Refresh';
  const dismiss = document.createElement('button');
  dismiss.className = 'dismiss';
  dismiss.textContent = '稍后 / Later';
  el.append(message, refresh, dismiss);
  document.body.appendChild(el);

  const b: UpdateBanner = { el, message, refresh, dismiss };
  refresh.addEventListener('click', () => {
    b.el.classList.remove('show');
    updateSW(true);
  });
  dismiss.addEventListener('click', () => b.el.classList.remove('show'));
  return b;
}

function showBanner() {
  if (!banner) banner = createBanner();
  banner.el.classList.add('show');
}

let updateSW: (reloadPage?: boolean) => Promise<void> = async () => {};

export function setupPWAUpdate() {
  updateSW = registerSW({
    // A new SW is waiting but we chose `prompt`, so notify the user.
    onNeedRefresh() {
      showBanner();
    },
    // Fired when the SW is ready / first installed. Nothing to do.
    onOfflineReady() {
      // eslint-disable-next-line no-console
      console.log('[pwa] offline ready');
    },
    onRegisterError(error) {
      console.error('[pwa] SW registration failed', error);
    },
  });
}
