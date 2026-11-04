'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export type ChibiPose = 'idle' | 'walk-a' | 'walk-b' | 'wave' | 'point' | 'laptop';

const POSES: readonly ChibiPose[] = ['idle', 'walk-a', 'walk-b', 'wave', 'point', 'laptop'];

export interface ChibiGuideProps {
  pose: ChibiPose;
  /** Mirror the sprite horizontally (sprites face right by default). */
  flipped?: boolean;
  walking?: boolean;
  alt: string;
  className?: string;
}

/**
 * ChibiGuide renders every pose stacked and only reveals the active one,
 * so switching poses never waits on a network request (no flicker).
 * If the sprite assets are missing, the guide silently hides itself.
 */
export function ChibiGuide({ pose, flipped = false, walking = false, alt, className }: ChibiGuideProps) {
  const [assetsMissing, setAssetsMissing] = useState(false);

  if (assetsMissing) return null;

  return (
    <div className={cn('relative select-none', className)} role="img" aria-label={alt}>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-2.5 w-3/5 -translate-x-1/2 rounded-full bg-foreground/15 blur-[2px]"
      />
      <div className={cn('absolute inset-0', walking ? 'chibi-walking' : 'chibi-breathing')}>
        {POSES.map((p) => (
          <Image
            key={p}
            src={`/characters/${p}.png`}
            alt=""
            aria-hidden="true"
            fill
            sizes="112px"
            draggable={false}
            onError={() => setAssetsMissing(true)}
            className={cn(
              'object-contain drop-shadow-md transition-opacity duration-100',
              p === pose ? 'opacity-100' : 'opacity-0',
            )}
            style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
          />
        ))}
      </div>
    </div>
  );
}

