import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function ShimmerButton({
  children,
  className,
  shimmerColor = '#ffffff',
  shimmerSize = '0.05em',
  shimmerDuration = '3s',
  borderRadius = '100px',
  background = 'rgba(0,0,0,1)',
  ...props
}: {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  borderRadius?: string;
  background?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      style={
        {
          '--shimmer-color': shimmerColor,
          borderRadius,
          background,
        } as CSSProperties
      }
      className={cn(
        'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [container-type:inline-size]',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 translate-x-[-100%] animate-shimmer bg-[linear-gradient(110deg,transparent,var(--shimmer-color),transparent)]"
          style={
            {
              '--shimmer-size': shimmerSize,
              '--shimmer-duration': shimmerDuration,
              maskImage: 'linear-gradient(to right, transparent, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
              height: '100%',
            } as CSSProperties
          }
        />
      </div>
      {children}
    </button>
  );
}
