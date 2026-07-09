import { navBar } from './_shared.ts';
import {
  loadSettings,
  saveSettings,
  isLocalMode,
  setLocalMode,
  OpenAISettings,
} from '../lib/settings.ts';
import { exportDatabase, importDatabase } from '../lib/localdb.ts';

export function renderSettings(root: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'page';
  wrap.appendChild(navBar('settings'));

  const panel = document.createElement('div');
  panel.className = 'settings-page';
  wrap.appendChild(panel);

  const s = loadSettings();
  const local = isLocalMode();

  panel.innerHTML = `
    <section class="settings-card">
      <h2>设置 · OpenAI 兼容接口</h2>
      <p class="muted">配置后，聊天框将调用真实大模型自动创建元件；未启用时回退到内置规则生成。可指向任意 OpenAI 兼容服务，包括本地模型（如 Ollama）。</p>
      <form class="settings-form">
        <label class="field full">
          <span>启用 AI 生成</span>
          <input type="checkbox" class="enabled" ${s.enabled ? 'checked' : ''} />
        </label>
        <label class="field full">
          <span>API Key</span>
          <input type="password" class="apiKey" value="${s.apiKey}" placeholder="sk-..." />
        </label>
        <label class="field full">
          <span>Model</span>
          <input type="text" class="model" value="${s.model}" placeholder="gpt-4o-mini" />
        </label>
        <label class="field full">
          <span>Base URL（OpenAI 兼容）</span>
          <input type="text" class="baseUrl" value="${s.baseUrl}" placeholder="https://api.openai.com/v1" />
        </label>
        <label class="field full">
          <span>支持图片输入（视觉校验）</span>
          <input type="checkbox" class="supportsVision" ${s.supportsVision ? 'checked' : ''} />
          <small class="muted">开启后，AI 改完元件会自动渲染预览图发给模型，校验是否仍需继续修改。需接口支持 vision。</small>
        </label>
        <div class="settings-actions">
          <button type="button" class="btn ghost preset-ollama">加载本地模型预设 (Ollama)</button>
          <span class="save-state"></span>
          <button type="submit" class="btn primary">保存</button>
        </div>
      </form>
    </section>

    <section class="settings-card">
      <h2>数据库 · 本地优先</h2>
      <p class="muted">所有数据默认保存在浏览器本地（localStorage），不依赖后端服务器。可把整个数据库导出为 ZIP 备份或迁移，再导入恢复。</p>
      <div class="settings-form">
        <label class="field full">
          <span>本地模式（不连接后端服务器）</span>
          <input type="checkbox" class="localMode" ${local ? 'checked' : ''} />
          <small class="muted">开启后，所有读写都使用本地存储，完全离线可用。关闭则尝试连接后端 /api 服务。</small>
        </label>
        <div class="settings-actions db-actions">
          <button type="button" class="btn primary export-db">导出数据库 (ZIP)</button>
          <button type="button" class="btn import-db">导入数据库 (ZIP)</button>
          <input type="file" class="import-file" accept=".zip,application/zip" hidden />
        </div>
        <p class="db-status muted"></p>
      </div>
    </section>
  `;

  const form = panel.querySelector('form') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const next: OpenAISettings = {
      enabled: (panel.querySelector('.enabled') as HTMLInputElement).checked,
      apiKey: (panel.querySelector('.apiKey') as HTMLInputElement).value.trim(),
      model: (panel.querySelector('.model') as HTMLInputElement).value.trim() || 'gpt-4o-mini',
      baseUrl: (panel.querySelector('.baseUrl') as HTMLInputElement).value.trim() || 'https://api.openai.com/v1',
      supportsVision: (panel.querySelector('.supportsVision') as HTMLInputElement).checked,
    };
    saveSettings(next);
    (panel.querySelector('.save-state') as HTMLElement).textContent = '已保存 ✓';
  });

  // Local-model (Ollama) preset: fill the fields so the AI can run on a local
  // endpoint instead of a cloud provider.
  panel.querySelector('.preset-ollama')?.addEventListener('click', () => {
    (panel.querySelector('.baseUrl') as HTMLInputElement).value = 'http://localhost:11434/v1';
    (panel.querySelector('.model') as HTMLInputElement).value = 'llama3';
    (panel.querySelector('.apiKey') as HTMLInputElement).value = 'ollama';
    (panel.querySelector('.enabled') as HTMLInputElement).checked = true;
    (panel.querySelector('.save-state') as HTMLElement).textContent = '已填入本地模型预设，请点「保存」';
  });

  // Local-mode toggle.
  const localInput = panel.querySelector('.localMode') as HTMLInputElement;
  localInput.addEventListener('change', () => {
    setLocalMode(localInput.checked);
  });

  // Export the entire database as a ZIP download.
  const status = panel.querySelector('.db-status') as HTMLElement;
  panel.querySelector('.export-db')?.addEventListener('click', async () => {
    status.textContent = '正在导出…';
    try {
      const blob = await exportDatabase();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      a.href = url;
      a.download = `shapecraft-db-${stamp}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      status.textContent = '已导出 ✓';
    } catch (err) {
      status.textContent = `导出失败：${(err as Error).message}`;
    }
  });

  // Import a ZIP that replaces the entire database.
  const fileInput = panel.querySelector('.import-file') as HTMLInputElement;
  panel.querySelector('.import-db')?.addEventListener('click', () => {
    if (!confirm('导入将覆盖当前整个数据库（元件 / 场景 / 动画 / 地图 / 设置）。确定继续？')) return;
    fileInput.click();
  });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    status.textContent = '正在导入…';
    try {
      const res = await importDatabase(file);
      if (res.errors.length) {
        status.textContent = `导入完成，但以下文件损坏：${res.errors.join(', ')}`;
      } else {
        status.textContent = `已导入：${res.imported.join(', ')}${res.skipped.length ? `（缺失：${res.skipped.join(', ')}）` : ''}`;
      }
      // Reload so every open view reflects the restored database.
      setTimeout(() => location.reload(), 400);
    } catch (err) {
      status.textContent = `导入失败：${(err as Error).message}`;
    } finally {
      fileInput.value = '';
    }
  });

  root.appendChild(wrap);
}
