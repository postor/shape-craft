import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export const NAV_LINKS: { href: string; label: string; key: string }[] = [
  { href: '#/', label: '首页', key: 'home' },
  { href: '#/library', label: '元件库', key: 'library' },
  { href: '#/characters', label: '角色', key: 'characters' },
  { href: '#/scenes', label: '场景', key: 'scene' },
  { href: '#/roam', label: '漫游', key: 'roam' },
  { href: '#/record', label: '扮演视频', key: 'play' },
  { href: '#/animations', label: '动画', key: 'animation' },
  { href: '#/maps', label: '地图', key: 'map' },
  { href: '#/demo', label: '▶ 劫案 Demo', key: 'demo' },
  { href: '#/settings', label: '设置', key: 'settings' },
];

function isActiveKey(key: string, hash: string): boolean {
  switch (key) {
    case 'home':
      return hash === '#/' || hash === '';
    case 'library':
      return hash.startsWith('#/library');
    case 'characters':
      return hash.startsWith('#/characters');
    case 'scene':
      return hash.startsWith('#/scenes');
    case 'roam':
      return hash.startsWith('#/roam');
    case 'play':
      return hash.startsWith('#/record');
    case 'animation':
      return hash.startsWith('#/animations');
    case 'map':
      return hash.startsWith('#/map') || hash.startsWith('#/maps');
    case 'demo':
      return hash.startsWith('#/demo');
    case 'settings':
      return hash.startsWith('#/settings');
    default:
      return false;
  }
}

export function NavBar({ active }: { active?: string }) {
  const hash = location.hash || '#/';
  // `active` is a PageShell hint; active state is derived from the live hash.
  void active;
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-panel px-5 py-3">
      <a className="text-[18px] font-bold" href="#/">
        🌱 ShapeCraft
      </a>
      <div className="flex items-center">
        {NAV_LINKS.map((l) => {
          const isActive = isActiveKey(l.key, hash);
          return (
            <a
              key={l.key}
              href={l.href}
              className={cn('ml-4 text-muted hover:text-text', isActive && 'text-text')}
              aria-current={isActive ? 'page' : undefined}
            >
              {l.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export function PageShell({
  active,
  children,
  className,
}: {
  active?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      <NavBar active={active} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="p-12 text-center text-muted">
      <p className="text-[18px] font-semibold text-text">{title}</p>
      {hint && <p className="mt-1.5 text-sm">{hint}</p>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 p-12 text-muted">
      <span className="h-[22px] w-[22px] animate-spin rounded-full border-[3px] border-white/15 border-t-accent" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
