import { navBar } from './_shared.ts';
import { getOrBuildTrainRobbery } from '../lib/director.ts';

/** Thin landing view for the "火车大劫案" demo: builds (or reuses) the scene
 *  and animation, then jumps straight into the animation editor. */
export async function renderDemo(root: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'page';
  wrap.appendChild(navBar('home'));

  const box = document.createElement('section');
  box.className = 'hero';
  box.innerHTML = `
    <h1>火车大劫案</h1>
    <p class="tagline">正在生成场景与动画…</p>
    <div class="cta">
      <button class="btn accent" disabled>⏳ 正在生成…</button>
    </div>
  `;
  wrap.appendChild(box);
  root.appendChild(wrap);

  try {
    const r = await getOrBuildTrainRobbery();
    location.hash = `#/animations/${r.animationId}`;
  } catch (err) {
    box.innerHTML = `
      <h1>火车大劫案</h1>
      <p class="tagline">生成失败：${(err as Error).message}</p>
      <div class="cta"><a class="btn" href="#/library">返回元件库</a></div>
    `;
  }
}
