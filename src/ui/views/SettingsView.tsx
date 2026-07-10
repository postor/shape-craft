import { useRef, useState } from 'react';
import { PageShell } from '../components';
import { useSettings } from '../../lib/hooks';
import { exportDatabase, importDatabase, type ImportResult } from '../../lib/localdb';
import { MagicCard, PlainButton, BlurFade } from '../magicui';

export function SettingsView() {
  const { settings, localMode, update, setMode } = useSettings();
  const [form, setForm] = useState(settings);
  const [importMsg, setImportMsg] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleExport() {
    const blob = await exportDatabase();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shapecraft-db.zip';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file: File) {
    setImportMsg('导入中…');
    try {
      const result: ImportResult = await importDatabase(file);
      setImportMsg(`导入完成：新增 ${result.imported.length}，跳过 ${result.skipped.length}，错误 ${result.errors.length}`);
    } catch (e) {
      setImportMsg(`导入失败：${(e as Error).message}`);
    }
  }

  return (
    <PageShell active="settings">
      <div className="mx-auto grid w-full max-w-[760px] grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <BlurFade>
          <MagicCard className="p-5" gradientFrom="#a78bfa" gradientTo="#22d3ee">
            <h3 className="mb-4 text-lg font-semibold">OpenAI 兼容设置</h3>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => set('enabled', e.target.checked)}
              />
              <span>启用 AI（关闭则使用规则生成）</span>
            </label>
            <div className="mb-3 flex flex-col gap-1.5 text-[13px] text-muted">
              <span className="text-[12px] text-muted">API Key</span>
              <input
                className="w-full rounded-lg border border-border bg-panel-2 px-2.5 py-2 text-sm text-text"
                type="password"
                value={form.apiKey}
                onChange={(e) => set('apiKey', e.target.value)}
                placeholder="sk-…"
              />
            </div>
            <div className="mb-3 flex flex-col gap-1.5 text-[13px] text-muted">
              <span className="text-[12px] text-muted">Model</span>
              <input
                className="w-full rounded-lg border border-border bg-panel-2 px-2.5 py-2 text-sm text-text"
                value={form.model}
                onChange={(e) => set('model', e.target.value)}
                placeholder="gpt-4o-mini"
              />
            </div>
            <div className="mb-3 flex flex-col gap-1.5 text-[13px] text-muted">
              <span className="text-[12px] text-muted">Base URL</span>
              <input
                className="w-full rounded-lg border border-border bg-panel-2 px-2.5 py-2 text-sm text-text"
                value={form.baseUrl}
                onChange={(e) => set('baseUrl', e.target.value)}
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <label className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={form.supportsVision}
                onChange={(e) => set('supportsVision', e.target.checked)}
              />
              <span>支持视觉（多模态截图）</span>
            </label>
            <div className="mt-4">
              <PlainButton onClick={() => update(form)}>保存设置</PlainButton>
            </div>
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.05}>
          <MagicCard className="p-5" gradientFrom="#34d399" gradientTo="#a78bfa">
            <h3 className="mb-4 text-lg font-semibold">本地数据库</h3>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={localMode}
                onChange={(e) => setMode(e.target.checked)}
              />
              <span>本地模式（localStorage，不连接后端）</span>
            </label>
            <div className="flex flex-col gap-3">
              <PlainButton onClick={() => void handleExport()}>导出数据库 (.zip)</PlainButton>
              <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-3.5 py-2 text-sm text-text transition-colors hover:border-accent" onClick={() => fileRef.current?.click()}>导入数据库</button>
              <input
                ref={fileRef}
                type="file"
                accept=".zip"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleImport(f);
                }}
              />
              {importMsg && <p className="text-sm text-neutral-300">{importMsg}</p>}
            </div>
          </MagicCard>
        </BlurFade>
      </div>
    </PageShell>
  );
}
