import { useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface RippleProps {
  children: ReactNode;
  className?: string;
  rippleColor?: string;
  rippleOpacity?: number;
  rippleDuration?: number;
}

export function Ripple({
  children,
  className,
  rippleColor = '#ffffff',
  rippleOpacity = 0.7,
  rippleDuration = 600,
}: RippleProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; size: number; id: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, size, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, rippleDuration);
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseDown={handleMouseDown}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={cn('pointer-events-none absolute rounded-full animate-ripple')}
          style={
            {
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor,
              opacity: rippleOpacity,
              animationDuration: `${rippleDuration}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
