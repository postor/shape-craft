import { useEffect, useState } from 'react';
import { PageShell, Spinner } from '../components';
import { getOrBuildTrainRobbery } from '../../lib/director';
import { AnimatedShinyText } from '../magicui';

export function DemoView() {
  const [status, setStatus] = useState('正在生成「火车大劫案」场景与动画…');

  useEffect(() => {
    let active = true;
    getOrBuildTrainRobbery()
      .then((result) => {
        if (!active) return;
        location.hash = `#/animations/${result.animationId}`;
      })
      .catch((e) => {
        if (active) setStatus(`生成失败：${(e as Error).message}`);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageShell active="demo">
      <div className="hero flex flex-col items-center justify-center gap-4 py-24">
        <span className="text-3xl">🎬</span>
        <AnimatedShinyText className="text-lg text-neutral-300">{status}</AnimatedShinyText>
        {status.startsWith('生成失败') ? (
          <button className="btn" onClick={() => (location.hash = '#/')}>
            ← 返回首页
          </button>
        ) : (
          <Spinner />
        )}
      </div>
    </PageShell>
  );
}
