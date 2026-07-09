import { navBar } from './_shared.ts';
import {
  listMaps,
  deleteMap,
  createMap,
  duplicateMap,
  renameMap,
  subscribeMaps,
} from '../lib/map-api.ts';
import type { MapComponent } from '../schema';
import { MAP_TEMPLATES, createMapFromTemplate, type MapInput } from '../schema';

export function renderMapLibrary(root: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'page';
  wrap.appendChild(navBar('map'));

  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <div>
      <h2>地图库</h2>
      <p class="muted">设计方形区域地图：地形、水域与已放置的元件实例。</p>
    </div>
    <a class="btn primary" href="#/map">+ 新建地图</a>
  `;
  wrap.appendChild(header);

  const quick = document.createElement('div');
  quick.className = 'quickbar';
  quick.innerHTML =
    '<span class="muted">快速创建：</span>' +
    MAP_TEMPLATES.map((t) => `<button class="chip" data-kind="${t.key}">${t.label}</button>`).join('');
  wrap.appendChild(quick);

  const grid = document.createElement('div');
  grid.className = 'asset-grid';
  wrap.appendChild(grid);

  async function refresh() {
    const maps = await listMaps();
    grid.innerHTML = '';
    if (maps.length === 0) {
      grid.innerHTML = '<p class="empty">还没有地图，点击「新建地图」或上方快捷按钮开始。</p>';
      return;
    }
    for (const m of maps) grid.appendChild(card(m));
  }

  function card(m: MapComponent): HTMLElement {
    const el = document.createElement('div');
    el.className = 'asset-card';
    el.innerHTML = `
      <div class="thumb">
        ${m.thumbnail ? `<img src="${m.thumbnail}" alt=""/>` : `<div class="thumb-placeholder">地图</div>`}
      </div>
      <div class="meta">
        <strong>${m.name}</strong>
        <span class="badge">${m.instances.length} 元件</span>
      </div>
      <div class="card-actions">
        <a class="btn small" href="#/map/${m.id}">编辑</a>
        <button class="btn small" data-dup="${m.id}">拷贝</button>
        <button class="btn small" data-rename="${m.id}">改名</button>
        <button class="btn small danger" data-del="${m.id}">删除</button>
      </div>
    `;
    return el;
  }

  grid.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const delId = target.getAttribute?.('data-del');
    if (delId) {
      if (confirm('确定删除该地图？')) {
        await deleteMap(delId);
        await refresh();
      }
      return;
    }
    const dupId = target.getAttribute?.('data-dup');
    if (dupId) {
      await duplicateMap(dupId);
      await refresh();
      return;
    }
    const renameId = target.getAttribute?.('data-rename');
    if (renameId) {
      const map = (await listMaps()).find((m) => m.id === renameId);
      const next = prompt('重命名地图：', map?.name ?? '');
      if (next && next.trim() && next.trim() !== map?.name) {
        await renameMap(renameId, next.trim());
        await refresh();
      }
      return;
    }
  });

  quick.addEventListener('click', async (e) => {
    const btn = e.target as HTMLElement;
    const kind = btn.getAttribute?.('data-kind');
    if (!kind) return;
    const draft = createMapFromTemplate(kind);
    const input: MapInput = {
      name: draft.name,
      description: draft.description,
      size: draft.size,
      terrain: draft.terrain,
      water: draft.water,
      instances: draft.instances,
      thumbnail: draft.thumbnail,
    };
    const saved = await createMap(input);
    location.hash = `#/map/${saved.id}`;
  });

  const unsub = subscribeMaps(refresh);
  wrap.addEventListener('remove', unsub);
  refresh();

  root.appendChild(wrap);
}
