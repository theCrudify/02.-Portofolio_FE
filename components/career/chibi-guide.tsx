'use client';

import { Code, Sparkles } from 'lucide-react';
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
  hopping?: boolean;
  alt: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Enhanced ChibiGuide with expressive accessories, animated particle sparks,
 * dynamic floating emotes, and lively hop reactions.
 */
export function ChibiGuide({
  pose,
  flipped = false,
  walking = false,
  hopping = false,
  alt,
  className,
  onClick,
}: ChibiGuideProps) {
  const [assetsMissing, setAssetsMissing] = useState(false);
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);

  if (assetsMissing) return null;

  const handleClick = () => {
    // Generate celebratory floating particle sparks on click
    const emojis = ['✨', '⭐', '💡', '🚀', '🔥', '🎉'];
    const newParticles = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)] ?? '✨',
      x: (Math.random() - 0.5) * 40,
      y: -10 - Math.random() * 25,
    }));
    setParticles((prev) => [...prev.slice(-6), ...newParticles]);

    // Cleanup particles
    setTimeout(() => {
      setParticles([]);
    }, 900);

    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative select-none cursor-pointer transition-transform hover:scale-105 active:scale-95',
        className,
      )}
      role="button"
      tabIndex={0}
      aria-label={alt}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Floating Particle Sparks on Click */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute left-1/2 top-1/3 z-30 font-emoji text-sm transition-all"
          style={{
            transform: `translate(calc(-50% + ${p.x}px), ${p.y}px)`,
            animation: 'chibi-sparkle 0.85s ease-out forwards',
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Floating Animated Accessory / Emote Badge */}
      {!walking ? (
        <div className="pointer-events-none absolute -top-1.5 -right-1 z-20 transition-all">
          {pose === 'laptop' ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-card shadow-md animate-bounce ring-2 ring-primary/20">
              <Code className="h-3 w-3 text-primary" />
            </span>
          ) : pose === 'wave' ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-card shadow-md animate-pulse ring-2 ring-primary/20 text-xs">
              👋
            </span>
          ) : pose === 'point' ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/40 bg-card shadow-md animate-bounce ring-2 ring-amber-500/20">
              <Sparkles className="h-3 w-3 text-amber-500" />
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Ground Shadow with Synchronized Breathing Scale */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute bottom-0 left-1/2 h-2.5 w-3/5 -translate-x-1/2 rounded-full bg-foreground/20 blur-[2px] transition-all',
          !walking && 'chibi-shadow',
        )}
      />

      {/* Character Sprite Container */}
      <div
        className={cn(
          'absolute inset-0',
          hopping ? 'chibi-hopping' : walking ? 'chibi-walking' : 'chibi-breathing',
        )}
      >
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
              'object-contain drop-shadow-md transition-opacity duration-150',
              p === pose ? 'opacity-100' : 'opacity-0',
            )}
            style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
          />
        ))}
      </div>
    </div>
  );
}
