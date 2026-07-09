import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  reverse?: boolean;
  duration?: number;
}

export function Marquee({
  children,
  pauseOnHover = false,
  direction = 'left',
  reverse = false,
  className,
  duration = 20,
  ...props
}: MarqueeProps) {
  const animationDirection =
    direction === 'left' || direction === 'up' ? 'normal' : 'reverse';
  const isVertical = direction === 'up' || direction === 'down';
  return (
    <div
      className={cn('group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]', className)}
      style={{ '--duration': `${duration}s` } as CSSProperties}
      {...props}
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)]',
            isVertical ? 'flex-col animate-marquee-vertical' : 'flex-row animate-marquee',
            pauseOnHover ? 'group-hover:[animation-play-state:paused]' : '',
            reverse ? '[animation-direction:reverse]' : '',
          )}
          style={{ animationDirection }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
