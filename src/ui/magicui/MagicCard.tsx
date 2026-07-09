import { useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = '#262626',
  gradientOpacity = 0.8,
  gradientFrom = '#9e7aff',
  gradientTo = '#ffaa40',
}: {
  children: ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative flex size-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900 text-white',
        className,
      )}
      style={
        {
          '--mouse-x': `${mouseX}px`,
          '--mouse-y': `${mouseY}px`,
          '--gradient-size': `${gradientSize}px`,
          '--gradient-color': gradientColor,
          '--gradient-opacity': gradientOpacity,
          '--gradient-from': gradientFrom,
          '--gradient-to': gradientTo,
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            'radial-gradient(var(--gradient-size) circle at var(--mouse-x) var(--mouse-y), var(--gradient-color), transparent 100%)',
          opacity: 'var(--gradient-opacity)',
          maskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)',
        }}
      />
      <div className="relative z-10 flex size-full">{children}</div>
    </div>
  );
}
