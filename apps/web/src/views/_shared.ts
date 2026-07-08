import { ASSET_CATEGORIES } from '@shape-craft/schema';

export function navBar(active: 'home' | 'library' | 'settings'): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'topnav';
  nav.innerHTML = `
    <a class="brand" href="#/">🌱 ShapeCraft</a>
    <div class="nav-links">
      <a href="#/" class="${active === 'home' ? 'active' : ''}">首页</a>
      <a href="#/library" class="${active === 'library' ? 'active' : ''}">元件库</a>
      <a href="#/settings" class="${active === 'settings' ? 'active' : ''}">设置</a>
    </div>
  `;
  return nav;
}

export function categoryLabel(c: string): string {
  const map: Record<string, string> = {
    tree: '树',
    flower: '花',
    grass: '草',
    house: '房子',
    rock: '石头',
    road: '道路',
    decor: '装饰',
    other: '其他',
  };
  return map[c] ?? c;
}

export function categoryOptions(selected: string): string {
  return ASSET_CATEGORIES.map(
    (c) => `<option value="${c}" ${c === selected ? 'selected' : ''}>${categoryLabel(c)}</option>`,
  ).join('');
}
