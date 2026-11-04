'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

export interface CountUpProps {
  value: number;
  suffix?: string;
}

/** Counts from 0 to `value` once visible. Server HTML holds the final value. */
export function CountUp({ value, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {`${value}${suffix}`}
    </span>
  );
}
