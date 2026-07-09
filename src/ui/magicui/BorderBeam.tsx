import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export function BorderBeam({
  className,
  size = 250,
  duration = 4,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#ffaa40',
  colorTo = '#1e40af',
  delay = 0,
}: {
  className?: string;
  size?: number;
  duration?: number;
  anchor?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}) {
  return (
    <div
      style={
        {
          '--size': size,
          '--duration': duration,
          '--anchor': anchor,
          '--border-width': borderWidth,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `-${delay}s`,
          '--radius': '0.75rem',
        } as CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]',
        '![mask:linear-gradient(to_right,#0000,var(--color-from)),linear-gradient(to_right,#000,var(--color-to))]',
        '![mask-clip:padding-box,border-box] ![mask-composite:intersect]',
        className,
      )}
    >
      <motion.div
        className="absolute aspect-square rounded-[100%] bg-gradient-to-l from-[var(--color-from)] to-[var(--color-to)]"
        style={{
          width: 'var(--size)',
          offsetPath: 'rect(0 auto auto 0 round var(--radius))',
          animation: 'border-beam calc(var(--duration)*1s) infinite linear',
          animationDelay: 'var(--delay)',
        }}
      />
    </div>
  );
}
