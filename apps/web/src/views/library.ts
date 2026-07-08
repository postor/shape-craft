import { navBar, categoryLabel } from './_shared.ts';
import { listAssets, deleteAsset, createAsset, duplicateAsset, renameAsset, subscribe } from '../lib/api.ts';
import type { AssetComponent } from '@shape-craft/schema';
import { PREFAB_TEMPLATES } from '@shape-craft/schema';

export function renderLibrary(root: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'page';
  wrap.appendChild(navBar('library'));

  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <div>
      <h2>元件库</h2>
      <p class="muted">管理可复用的 3D 元件（prefab）。</p>
    </div>
    <a class="btn primary" href="#/editor">+ 新建元件</a>
  `;
  wrap.appendChild(header);

  const quick = document.createElement('div');
  quick.className = 'quickbar';
  quick.innerHTML =
    '<span class="muted">快速创建：</span>' +
    PREFAB_TEMPLATES.map(
      (t) => `<button class="chip" data-kind="${t.key}">${t.label}</button>`,
    ).join('');
  wrap.appendChild(quick);

  const grid = document.createElement('div');
  grid.className = 'asset-grid';
  wrap.appendChild(grid);

  async function refresh() {
    const assets = await listAssets();
    grid.innerHTML = '';
    if (assets.length === 0) {
      grid.innerHTML = '<p class="empty">还没有元件，点击「新建元件」或上方快捷按钮开始。</p>';
      return;
    }
    for (const a of assets) grid.appendChild(card(a));
  }

  function card(a: AssetComponent): HTMLElement {
    const el = document.createElement('div');
    el.className = 'asset-card';
    el.innerHTML = `
      <div class="thumb">
        ${a.thumbnail ? `<img src="${a.thumbnail}" alt=""/>` : `<div class="thumb-placeholder">${categoryLabel(a.category)}</div>`}
      </div>
      <div class="meta">
        <strong>${a.name}</strong>
        <span class="badge">${categoryLabel(a.category)}</span>
      </div>
      <div class="card-actions">
        <a class="btn small" href="#/editor/${a.id}">编辑</a>
        <button class="btn small" data-dup="${a.id}">拷贝</button>
        <button class="btn small" data-rename="${a.id}">改名</button>
        <button class="btn small danger" data-del="${a.id}">删除</button>
      </div>
    `;
    return el;
  }

  grid.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const delId = target.getAttribute?.('data-del');
    if (delId) {
      if (confirm('确定删除该元件？')) {
        await deleteAsset(delId);
        await refresh();
      }
      return;
    }
    const dupId = target.getAttribute?.('data-dup');
    if (dupId) {
      await duplicateAsset(dupId);
      await refresh();
      return;
    }
    const renameId = target.getAttribute?.('data-rename');
    if (renameId) {
      const asset = (await listAssets()).find((a) => a.id === renameId);
      const next = prompt('重命名元件：', asset?.name ?? '');
      if (next && next.trim() && next.trim() !== asset?.name) {
        await renameAsset(renameId, next.trim());
        await refresh();
      }
      return;
    }
  });

  quick.addEventListener('click', async (e) => {
    const btn = e.target as HTMLElement;
    const kind = btn.getAttribute?.('data-kind');
    if (!kind) return;
    const tpl = PREFAB_TEMPLATES.find((t) => t.key === kind)!;
    const asset = await createAsset({
      name: tpl.defaultName,
      category: tpl.key as AssetComponent['category'],
      description: `由快捷按钮创建：${tpl.label}`,
      root: tpl.build(),
    });
    location.hash = `#/editor/${asset.id}`;
  });

  const unsub = subscribe(refresh);
  wrap.addEventListener('remove', unsub);
  refresh();

  root.appendChild(wrap);
}
