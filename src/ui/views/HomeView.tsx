import type { CSSProperties } from 'react';
import { PageShell } from '../components';
import {
  AnimatedGradientText,
  gradientColors,
  AnimatedShinyText,
  PlainButton,
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
      <section className="px-5 pb-10 pt-20 text-center" style={gradientColors as CSSProperties}>
        <AnimatedGradientText className="text-[56px] font-bold leading-tight tracking-tight">
          ShapeCraft
        </AnimatedGradientText>
        <AnimatedShinyText className="mt-3 text-[18px] text-muted">
          AI 驱动的 3D 世界与多人游戏创作平台 · 第一阶段：元件库与编辑器
        </AnimatedShinyText>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <PlainButton onClick={() => (location.hash = '#/library')}>进入元件库</PlainButton>
          <PlainButton onClick={() => (location.hash = '#/scenes')}>场景编辑</PlainButton>
          <PlainButton onClick={() => (location.hash = '#/demo')}>▶ 导演：火车大劫案</PlainButton>
        </div>
        <p className="mt-4 text-sm text-muted">
          用基础形状 + 材质构造 树 / 花 / 草 / 房子，或用聊天自动生成。
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 px-10 pb-15 pt-5">
        {FEATURES.map((f, i) => (
          <BlurFade key={f.title} delay={i * 0.05}>
            <MagicCard className="flex flex-col rounded-[10px] border border-border bg-panel p-5">
              <div className="flex flex-col items-start gap-2">
                <h3 className="text-lg font-semibold leading-snug">{f.title}</h3>
                <p className="whitespace-normal text-sm text-muted">{f.desc}</p>
              </div>
            </MagicCard>
          </BlurFade>
        ))}
      </section>
    </PageShell>
  );
}
