import { ASSET_CATEGORIES } from '../schema';

export function navBar(active: 'home' | 'library' | 'settings' | 'characters' | 'scene' | 'map' | 'animation' | 'roam' | 'play'): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'topnav';
  nav.innerHTML = `
    <a class="brand" href="#/">🌱 ShapeCraft</a>
    <div class="nav-links">
      <a href="#/" class="${active === 'home' ? 'active' : ''}">首页</a>
      <a href="#/library" class="${active === 'library' ? 'active' : ''}">元件库</a>
      <a href="#/characters" class="${active === 'characters' ? 'active' : ''}">角色</a>
      <a href="#/scenes" class="${active === 'scene' ? 'active' : ''}">场景</a>
      <a href="#/roam" class="${active === 'roam' ? 'active' : ''}">漫游</a>
      <a href="#/record" class="${active === 'play' ? 'active' : ''}">扮演视频</a>
      <a href="#/animations" class="${active === 'animation' ? 'active' : ''}">动画</a>
      <a class="demo-link" href="#/demo">▶ 劫案 Demo</a>
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
    character: '角色',
    waterfall: '瀑布',
    other: '其他',
  };
  return map[c] ?? c;
}

export function categoryOptions(selected: string): string {
  return ASSET_CATEGORIES.map(
    (c) => `<option value="${c}" ${c === selected ? 'selected' : ''}>${categoryLabel(c)}</option>`,
  ).join('');
}
