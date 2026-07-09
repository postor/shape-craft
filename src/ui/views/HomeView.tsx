import type { CSSProperties } from 'react';
import { PageShell } from '../components';
import {
  AnimatedGradientText,
  gradientColors,
  AnimatedShinyText,
  ShimmerButton,
  BlurFade,
  MagicCard,
} from '../magicui';

const FEATURES: { title: string; desc: string }[] = [
  { title: '元件库 CRUD', desc: '创建、查看、编辑、删除可复用的 3D 元件（prefab），保存为内部 JSON。' },
  { title: '可视化编辑器', desc: '基于 box / sphere / cylinder / cone / plane 的组合、层级、变换与材质。' },
  { title: '聊天式建造', desc: '“帮我造一棵树” 即自动生成并附加基础材质，无需手工拼装。' },
  { title: '角色设计 · 轴动画', desc: '人形 / 四足 / 飞行三类骨架，脚本槽位驱动的站立、坐、走、飞翔动画。' },
  { title: '场景编辑 · 地形 / 物件', desc: '方形区域：地形笔刷 + 水位控制；切到物件模式把元件摆上地形。' },
  { title: '动画编辑 · 相机 / 物件', desc: '选择场景自动生成轨道；增建自定义轨道并调整关键帧与区段状态。' },
];

export function HomeView() {
  return (
    <PageShell active="home">
      <section className="hero" style={gradientColors as CSSProperties}>
        <AnimatedGradientText className="hero-title text-5xl font-bold leading-tight">
          ShapeCraft
        </AnimatedGradientText>
        <AnimatedShinyText className="tagline mt-3 text-base text-neutral-300">
          AI 驱动的 3D 世界与多人游戏创作平台 · 第一阶段：元件库与编辑器
        </AnimatedShinyText>
        <div className="cta mt-6 flex flex-wrap gap-3">
          <ShimmerButton onClick={() => (location.hash = '#/library')}>进入元件库</ShimmerButton>
          <ShimmerButton onClick={() => (location.hash = '#/scenes')}>场景编辑</ShimmerButton>
          <ShimmerButton onClick={() => (location.hash = '#/demo')}>▶ 导演：火车大劫案</ShimmerButton>
        </div>
        <p className="hint mt-4 text-sm text-neutral-400">
          用基础形状 + 材质构造 树 / 花 / 草 / 房子，或用聊天自动生成。
        </p>
      </section>

      <section className="features">
        {FEATURES.map((f, i) => (
          <BlurFade key={f.title} delay={i * 0.05}>
            <MagicCard className="feature p-5">
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-neutral-300">{f.desc}</p>
            </MagicCard>
          </BlurFade>
        ))}
      </section>
    </PageShell>
  );
}
