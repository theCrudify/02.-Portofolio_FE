'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface AnimatedRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}

export function AnimatedReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimatedRevealProps) {
  const initialOffset = {
    up: { opacity: 0, y: 24 },
    down: { opacity: 0, y: -24 },
    left: { opacity: 0, x: 24 },
    right: { opacity: 0, x: -24 },
    scale: { opacity: 0, scale: 0.95 },
  }[direction];

  return (
    <motion.div
      initial={initialOffset}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.48,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
