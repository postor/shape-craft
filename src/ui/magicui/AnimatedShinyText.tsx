import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 100,
}: {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}) {
  return (
    <p
      style={{ '--shiny-width': `${shimmerWidth}px` } as CSSProperties}
      className={cn(
        'animate-shine bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%]',
        'bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:from-transparent dark:via-white/80 dark:to-transparent',
        className,
      )}
    >
      {children}
    </p>
  );
}
