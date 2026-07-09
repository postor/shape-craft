import { navBar } from './_shared.ts';

export function renderHome(root: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'page';
  wrap.appendChild(navBar('home'));

  const hero = document.createElement('section');
  hero.className = 'hero';
    hero.innerHTML = `
    <h1>ShapeCraft</h1>
    <p class="tagline">AI 驱动的 3D 世界与多人游戏创作平台 · 第一阶段：元件库与编辑器</p>
    <div class="cta">
      <a class="btn primary" href="#/library">进入元件库</a>
      <a class="btn" href="#/scenes">场景编辑</a>
      <a class="btn accent" href="#/demo">▶ 导演：火车大劫案</a>
    </div>
    <p class="hint">用基础形状 + 材质构造 树 / 花 / 草 / 房子，或用聊天自动生成。</p>
  `;
  wrap.appendChild(hero);

  const features = document.createElement('section');
  features.className = 'features';
  features.innerHTML = `
    <div class="feature">
      <h3>元件库 CRUD</h3>
      <p>创建、查看、编辑、删除可复用的 3D 元件（prefab），保存为内部 JSON。</p>
    </div>
    <div class="feature">
      <h3>可视化编辑器</h3>
      <p>基于 box / sphere / cylinder / cone / plane 的组合、层级、变换与材质。</p>
    </div>
    <div class="feature">
      <h3>聊天式建造</h3>
      <p>“帮我造一棵树” 即自动生成并附加基础材质，无需手工拼装。</p>
    </div>
    <div class="feature">
      <h3><a href="#/characters">角色设计 · 轴动画</a></h3>
      <p>人形 / 四足 / 飞行三类骨架，脚本槽位驱动的站立、坐、走、飞翔动画，可调节速度角度。</p>
    </div>
    <div class="feature">
      <h3><a href="#/scenes">场景编辑 · 地形 / 物件</a></h3>
      <p>方形区域：地形模式下抬高 / 降低笔刷 + 水位控制；切到物件模式把元件（含角色）摆上地形。</p>
    </div>
    <div class="feature">
      <h3><a href="#/animations">动画编辑 · 相机 / 物件</a></h3>
      <p>选择一个已有场景，自动生成相机与相机目标（空 node）轨道；可增建自定义轨道绑定角色 / 元件，在关键帧调整位置并设置区段动画状态（走 / 飞）。每个物件最多一个轨道。</p>
    </div>
  `;
  wrap.appendChild(features);

  root.appendChild(wrap);
}
