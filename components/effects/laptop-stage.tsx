'use client';

import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { LaptopCode, LaptopPalette } from '@/components/effects/laptop-scene';
import cloudinaryLoader from '@/lib/cloudinary-loader';
import { cn } from '@/lib/utils';

// three.js only loads in the browser, and only once the hero is near the viewport.
const LaptopScene = dynamic(() => import('@/components/effects/laptop-scene'), {
  ssr: false,
});

export interface LaptopStageProps {
  code: LaptopCode;
  /** Project cover URLs shown after the code screen. */
  images: string[];
  label: string;
  screenLabel: (index: number) => string;
  className?: string;
}

const AUTO_ADVANCE_MS = 6000;

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Resolve CSS colour tokens (oklch) to rgb() strings by painting one pixel. */
function readPalette(el: HTMLElement, dark: boolean): LaptopPalette | null {
  const probe = document
    .createElement('canvas')
    .getContext('2d', { willReadFrequently: true });
  if (!probe) return null;
  const style = getComputedStyle(el);
  const rgb = (token: string) => {
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = style.getPropertyValue(token).trim() || 'gray';
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  };
  return {
    body: rgb(dark ? '--muted-foreground' : '--border'),
    deck: rgb('--muted'),
    key: rgb('--card'),
    // The editor stays dark in both themes.
    screenBg: rgb(dark ? '--background' : '--foreground'),
    screenFg: rgb(dark ? '--foreground' : '--background'),
    muted: rgb('--muted-foreground'),
    primary: rgb('--primary'),
    success: rgb('--success'),
    warning: rgb('--warning'),
    danger: rgb('--destructive'),
  };
}

export function LaptopStage({
  code,
  images,
  label,
  screenLabel,
  className,
}: LaptopStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [palette, setPalette] = useState<LaptopPalette | null>(null);
  const [active, setActive] = useState(0);
  const screenCount = images.length + 1;

  useEffect(() => {
    setWebgl(hasWebGL());
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (ref.current) setPalette(readPalette(ref.current, resolvedTheme === 'dark'));
  }, [resolvedTheme]);

  useEffect(() => {
    if (reducedMotion || screenCount < 2 || !visible) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % screenCount),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [reducedMotion, screenCount, visible]);

  const imageUrls = useMemo(
    () => images.map((src) => cloudinaryLoader({ src, width: 1024 })),
    [images],
  );

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <div
        ref={ref}
        role="img"
        aria-label={label}
        className="relative aspect-[5/4] w-full max-w-[640px]"
      >
        {/* Soft floor glow under the laptop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] bottom-[14%] h-[18%] rounded-[50%] opacity-60 blur-2xl"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in oklab, var(--primary) 45%, transparent), transparent)',
          }}
        />
        {webgl && near && palette ? (
          <LaptopScene
            palette={palette}
            code={code}
            images={imageUrls}
            active={active}
            reducedMotion={reducedMotion}
            paused={!visible}
          />
        ) : !webgl ? (
          <div className="absolute inset-[18%_10%] flex flex-col justify-center gap-2 rounded-2xl border border-border bg-foreground p-6 font-mono text-sm text-background shadow-2xl dark:bg-background dark:text-foreground">
            <span className="text-primary">const engineer = {'{'}</span>
            <span className="truncate pl-4">name: &apos;{code.name}&apos;,</span>
            <span className="truncate pl-4">role: &apos;{code.role}&apos;,</span>
            <span className="text-primary">{'}'};</span>
          </div>
        ) : null}
      </div>

      {screenCount > 1 ? (
        <div className="-mt-4 flex items-center gap-2">
          {Array.from({ length: screenCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={screenLabel(i + 1)}
              aria-pressed={i === active}
              className={cn(
                'h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                i === active
                  ? 'w-7 bg-primary'
                  : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/80',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
