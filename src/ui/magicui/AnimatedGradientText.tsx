import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-[linear-gradient(to_right,var(--color-1),var(--color-2),var(--color-3),var(--color-4),var(--color-5),var(--color-4),var(--color-3),var(--color-2),var(--color-1))] bg-[length:var(--bg-size,300%)_100%] bg-clip-text text-transparent',
        'animate-gradient',
        className,
      )}
    >
      {children}
    </div>
  );
}

export const gradientColors: Record<string, string> = {
  '--color-1': '#6ee7b7',
  '--color-2': '#34d399',
  '--color-3': '#22d3ee',
  '--color-4': '#a78bfa',
  '--color-5': '#f472b6',
};
