'use client';

import {
  MultiImageShowcase,
  type ShowcaseMediaItem,
} from '@/components/media/multi-image-showcase';
import type { PublicProjectMediaItem } from '@/lib/api/types';

export interface ProjectGalleryProps {
  items: PublicProjectMediaItem[];
}

export function ProjectGallery({ items }: ProjectGalleryProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const showcaseItems: ShowcaseMediaItem[] = items.map((item, idx) => ({
    id: item.id,
    url: item.url,
    alt: item.alt || item.caption || `Gallery visual ${idx + 1}`,
    title: item.title ?? item.caption ?? `Visual #${idx + 1}`,
    caption: item.caption ?? undefined,
    category: item.kind === 'architecture' ? 'Architecture' : 'Gallery',
    featured: idx === 0,
  }));

  return <MultiImageShowcase items={showcaseItems} defaultLayout="bento" />;
}
