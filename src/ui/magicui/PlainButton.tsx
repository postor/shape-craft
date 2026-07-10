import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function PlainButton({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-normal rounded-full border border-border bg-panel-2 px-6 py-3 text-sm font-medium text-text transition-colors hover:border-accent hover:bg-panel',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
