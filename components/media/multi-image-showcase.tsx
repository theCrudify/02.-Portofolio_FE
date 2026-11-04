'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Grid2X2,
  Images,
  LayoutDashboard,
  Rows3,
  Search,
} from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface ShowcaseImageEntry {
  id: string;
  url: string;
  alt: string;
  title?: string | null;
  caption?: string | null;
  category?: string;
  width?: number | null;
  height?: number | null;
}

export interface MultiImageShowcaseProps {
  items: ShowcaseImageEntry[];
  enableFilter?: boolean;
  enableLayoutSwitch?: boolean;
  defaultLayout?: 'bento' | 'grid' | 'filmstrip';
}

/**
 * MultiImageShowcase: High-capacity interactive gallery capable of placing and displaying
 * many images with Bento/Grid/Filmstrip layouts, category filters, instant search, and
 * full-screen Lightbox with thumbnail navigation.
 */
export function MultiImageShowcase({
  items,
  enableFilter = true,
  enableLayoutSwitch = true,
  defaultLayout = 'bento',
}: MultiImageShowcaseProps) {
  const [layout, setLayout] = React.useState<'bento' | 'grid' | 'filmstrip'>(defaultLayout);
  const [activeCategory, setActiveCategory] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.category) set.add(item.category);
    }
    return ['all', ...Array.from(set)];
  }, [items]);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (searchTerm.trim().length > 0) {
        const q = searchTerm.toLowerCase();
        const matchTitle = (item.title ?? '').toLowerCase().includes(q);
        const matchCaption = (item.caption ?? '').toLowerCase().includes(q);
        const matchAlt = (item.alt ?? '').toLowerCase().includes(q);
        return matchTitle || matchCaption || matchAlt;
      }
      return true;
    });
  }, [items, activeCategory, searchTerm]);

  if (!items || items.length === 0) {
    return null;
  }

  const selectedItem = activeIndex !== null ? filteredItems[activeIndex] ?? null : null;

  const handlePrev = () => {
    if (activeIndex === null || filteredItems.length === 0) return;
    setActiveIndex((activeIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    if (activeIndex === null || filteredItems.length === 0) return;
    setActiveIndex((activeIndex + 1) % filteredItems.length);
  };

  return (
    <div className="space-y-5">
      {(enableFilter && categories.length > 2) || enableLayoutSwitch ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/70 p-3 backdrop-blur-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {enableFilter && categories.length > 2
              ? categories.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    size="sm"
                    variant={activeCategory === cat ? 'default' : 'outline'}
                    onClick={() => {
                      setActiveCategory(cat);
                      setActiveIndex(null);
                    }}
                    className="h-8 capitalize"
                  >
                    {cat}
                  </Button>
                ))
              : (
                <div className="inline-flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground">
                  <Images className="h-4 w-4 text-primary" />
                  <span>{filteredItems.length} Images in Gallery</span>
                </div>
              )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {enableFilter && items.length > 3 ? (
              <div className="relative w-44 sm:w-56">
                <Search className="pointer-events-none absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search visuals..."
                  aria-label="Search visuals"
                  className="h-8 pl-8 text-xs"
                />
              </div>
            ) : null}

            {enableLayoutSwitch ? (
              <div className="inline-flex rounded-lg border border-border bg-muted p-0.5">
                <button
                  type="button"
                  onClick={() => setLayout('bento')}
                  aria-label="Bento layout"
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    layout === 'bento'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Bento</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  aria-label="Grid layout"
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    layout === 'grid'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Grid2X2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('filmstrip')}
                  aria-label="Filmstrip layout"
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    layout === 'filmstrip'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Rows3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Showcase</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {layout === 'filmstrip' ? (
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted shadow-md">
            <Image
              src={(filteredItems[0] ?? items[0]!).url}
              alt={(filteredItems[0] ?? items[0]!).alt || 'Featured visual'}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-4 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-foreground sm:text-lg">
                    {(filteredItems[0] ?? items[0]!).title ?? (filteredItems[0] ?? items[0]!).alt}
                  </p>
                  {(filteredItems[0] ?? items[0]!).caption ? (
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      {(filteredItems[0] ?? items[0]!).caption}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setActiveIndex(0)}
                >
                  <Expand className="h-3.5 w-3.5" />
                  <span>Full Screen</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {filteredItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={item.url}
                  alt={item.alt || item.caption || `Visual ${idx + 1}`}
                  fill
                  sizes="20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-4',
            layout === 'bento'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
          )}
        >
          {filteredItems.map((item, idx) => {
            const isHeroTile = layout === 'bento' && idx === 0 && filteredItems.length >= 3;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  'group relative aspect-video overflow-hidden rounded-xl border border-border/80 bg-muted text-left shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isHeroTile ? 'sm:col-span-2 sm:row-span-2' : '',
                )}
              >
                <Image
                  src={item.url}
                  alt={item.alt || item.caption || 'Gallery image'}
                  fill
                  sizes={
                    isHeroTile
                      ? '(max-width: 768px) 100vw, 66vw'
                      : '(max-width: 768px) 100vw, 33vw'
                  }
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/15 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="rounded-full bg-background/85 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-foreground backdrop-blur-xs">
                    {String(idx + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
                  </span>
                  {item.category ? (
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {item.category}
                    </Badge>
                  ) : null}
                </div>

                <div className="absolute top-3 right-3 rounded-full bg-background/85 p-2 text-foreground opacity-0 shadow-xs backdrop-blur-xs transition-all duration-200 group-hover:opacity-100">
                  <Expand className="h-3.5 w-3.5" />
                </div>

                {item.title || item.caption ? (
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    {item.title ? (
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                    ) : null}
                    {item.caption ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {item.caption}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      <Dialog
        open={selectedItem !== null}
        onOpenChange={(open) => {
          if (!open) setActiveIndex(null);
        }}
        title={
          selectedItem?.title ??
          selectedItem?.caption ??
          `Gallery Preview (${(activeIndex ?? 0) + 1}/${filteredItems.length})`
        }
        className="max-w-5xl"
      >
        {selectedItem ? (
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={selectedItem.url}
                alt={selectedItem.alt || selectedItem.caption || 'Gallery preview'}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                {selectedItem.caption ? (
                  <p className="text-sm text-muted-foreground">{selectedItem.caption}</p>
                ) : null}
              </div>

              {filteredItems.length > 1 ? (
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handlePrev}>
                    <ChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                  </Button>
                  <span className="font-mono text-xs text-muted-foreground">
                    {(activeIndex ?? 0) + 1} / {filteredItems.length}
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={handleNext}>
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </div>

            {filteredItems.length > 1 ? (
              <div className="grid grid-cols-6 gap-2 pt-2 sm:grid-cols-8">
                {filteredItems.map((thumb, idx) => (
                  <button
                    key={thumb.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      'relative aspect-video overflow-hidden rounded-md border transition-all',
                      idx === activeIndex
                        ? 'border-primary ring-2 ring-primary/40'
                        : 'border-border opacity-60 hover:opacity-100',
                    )}
                  >
                    <Image
                      src={thumb.url}
                      alt={thumb.alt || `Thumbnail ${idx + 1}`}
                      fill
                      sizes="12vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}

