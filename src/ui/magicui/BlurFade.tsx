import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  blur = '6px',
}: {
  children: ReactNode;
  className?: string;
  variant?: Variants;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  blur?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewResult = useInView(ref, { once: true });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant ?? defaultVariants;
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      exit="hidden"
      variants={combinedVariants}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
