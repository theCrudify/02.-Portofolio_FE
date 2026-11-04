'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * AuroraBackground: Ambient animated gradient orbs and subtle architectural grid overlay.
 */
export function AuroraBackground({ className, children }: AuroraBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-24 h-96 w-96 rounded-full opacity-25 blur-3xl transition-transform duration-1000"
          style={{
            background:
              'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/4 -right-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, var(--ring) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>
      {children}
    </div>
  );
}
