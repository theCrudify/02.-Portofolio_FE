'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/** Fallback when no icon is set: "Node.js" -> "nodedotjs", the simple-icons convention. */
export function simpleIconSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]/g, '');
}

export interface TechLogoProps {
  name: string;
  /** Icon set in the admin (technologies.icon): a simple-icons slug or a full URL. */
  icon?: string | null;
  className?: string;
}

/** Brand logo from simple-icons; falls back to a primary dot when the brand has no icon. */
export function TechLogo({ name, icon, className }: TechLogoProps) {
  const [failed, setFailed] = useState(false);
  const src = icon?.startsWith('http')
    ? icon
    : `https://cdn.simpleicons.org/${icon || simpleIconSlug(name)}`;

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className="mx-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md p-0.5 dark:bg-foreground/90',
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        width={16}
        height={16}
        unoptimized
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
