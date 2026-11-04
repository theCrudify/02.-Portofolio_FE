'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import type { PublicProjectMediaItem } from '@/lib/api/types';

export interface ProjectGalleryProps {
  items: PublicProjectMediaItem[];
}

export function ProjectGallery({ items }: ProjectGalleryProps) {
  const [selected, setSelected] = useState<PublicProjectMediaItem | null>(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item)}
            className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src={item.url}
              alt={item.alt || item.caption || 'Gallery image'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
            {item.caption ? (
              <div className="absolute inset-x-0 bottom-0 bg-background/85 px-3 py-1.5 text-xs text-foreground backdrop-blur-xs">
                {item.caption}
              </div>
            ) : null}
          </button>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected?.title ?? selected?.caption ?? 'Project Gallery'}
        className="max-w-4xl"
      >
        {selected ? (
          <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
              <Image
                src={selected.url}
                alt={selected.alt || selected.caption || 'Gallery preview'}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {selected.caption ? (
              <p className="text-sm text-muted-foreground">{selected.caption}</p>
            ) : null}
          </div>
        ) : null}
      </Dialog>
    </>
  );
}

