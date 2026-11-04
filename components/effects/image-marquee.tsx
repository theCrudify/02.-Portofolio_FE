'use client';

import * as React from 'react';
import Image from 'next/image';
import { Expand, Layers } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { VisualShowcaseItem } from '@/lib/visuals';

export interface ImageMarqueeProps {
  items: VisualShowcaseItem[];
  title?: string;
}

/**
 * ImageMarquee: Interactive multi-image horizontal visual filmstrip with click-to-zoom lightbox.
 */
export function ImageMarquee({ items, title }: ImageMarqueeProps) {
  const [selected, setSelected] = React.useState<VisualShowcaseItem | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      {title ? (
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Layers className="h-3.5 w-3.5" />
            <span>{title}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {items.length} visual snapshots · Click any frame to inspect
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        {items.slice(0, 8).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item)}
            className="group relative aspect-video overflow-hidden rounded-xl border border-border/80 bg-muted text-left shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute top-2 right-2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
              <Expand className="h-3 w-3" />
            </div>
            <div className="absolute inset-x-2 bottom-2 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <Badge variant="secondary" className="mb-1 text-[10px] uppercase">
                {item.category}
              </Badge>
              <p className="line-clamp-1 text-xs font-semibold text-foreground">
                {item.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected?.title ?? 'Visual Preview'}
        className="max-w-4xl"
      >
        {selected ? (
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={selected.url}
                alt={selected.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">{selected.caption}</p>
              <Badge variant="outline" className="uppercase">
                {selected.category}
              </Badge>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}

