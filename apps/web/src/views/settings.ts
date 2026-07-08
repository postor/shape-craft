import { navBar } from './_shared.ts';
import { loadSettings, saveSettings, OpenAISettings } from '../lib/settings.ts';

export function renderSettings(root: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'page';
  wrap.appendChild(navBar('settings'));

  const panel = document.createElement('div');
  panel.className = 'settings-page';
  wrap.appendChild(panel);

  const s = loadSettings();

  panel.innerHTML = `
    <h2>设置 · OpenAI 兼容接口</h2>
    <p class="muted">配置后，聊天框将调用真实大模型自动创建元件；未启用时回退到内置规则生成。</p>
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
        <span class="save-state"></span>
        <button type="submit" class="btn primary">保存</button>
      </div>
    </form>
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

  root.appendChild(wrap);
}
