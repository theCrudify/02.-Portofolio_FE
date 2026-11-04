'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactiveTilt?: boolean;
}

/**
 * SpotlightCard: Interactive card with mouse-tracking radial spotlight glow,
 * true 3D perspective hover tilt, specular sheen reflection, and illuminated border ring.
 */
export function SpotlightCard({
  children,
  className,
  interactiveTilt = false,
  ...props
}: SpotlightCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const [tilt, setTilt] = React.useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (interactiveTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / Math.max(centerY, 1)) * -6;
      const rotateY = ((x - centerX) / Math.max(centerX, 1)) * 6;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setTilt({ rotateX, rotateY, glareX, glareY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: interactiveTilt
          ? `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
          : undefined,
        transformStyle: interactiveTilt ? 'preserve-3d' : undefined,
      }}
      className={cn(
        'group/spotlight relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 text-card-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-2xl dark:bg-card/85 dark:shadow-lg dark:hover:border-primary/60',
        className,
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in oklab, var(--primary) 22%, transparent), transparent 45%)`,
        }}
      />

      {/* 3D Specular Sheen Reflection Layer */}
      {interactiveTilt ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-1 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.4 : 0,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, color-mix(in oklab, var(--foreground) 15%, transparent), transparent 60%)`,
          }}
        />
      ) : null}

      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}
