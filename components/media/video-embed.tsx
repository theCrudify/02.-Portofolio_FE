'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { track } from '@/lib/events';

export interface VideoEmbedProps {
  /** media_provider code; unknown providers fall back to the plain URL. */
  provider: string;
  embedId: string | null;
  url: string;
  thumbnailUrl?: string | null;
  title?: string | null;
  projectSlug?: string;
}

export function getEmbedIframeUrl(
  provider: VideoEmbedProps['provider'],
  embedId: string | null,
  fallbackUrl: string,
): string {
  if (provider === 'youtube' && embedId) {
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(embedId)}?autoplay=1&rel=0`;
  }
  if (provider === 'vimeo' && embedId) {
    return `https://player.vimeo.com/video/${encodeURIComponent(embedId)}?autoplay=1`;
  }
  if (provider === 'loom' && embedId) {
    return `https://www.loom.com/embed/${encodeURIComponent(embedId)}?autoplay=1`;
  }
  return fallbackUrl;
}

export function VideoEmbed({
  provider,
  embedId,
  url,
  thumbnailUrl,
  title,
  projectSlug,
}: VideoEmbedProps) {
  const [activated, setActivated] = useState(false);

  const handlePlay = () => {
    setActivated(true);
    track('video_play', {
      projectSlug,
      target: embedId ?? provider,
    });
  };

  const iframeSrc = getEmbedIframeUrl(provider, embedId, url);
  const videoTitle = title || 'Project demo video';

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
      {activated ? (
        <iframe
          src={iframeSrc}
          title={videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play video: ${videoTitle}`}
          className="group relative flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={videoTitle}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : null}
          <div className="absolute inset-0 bg-foreground/25 transition-opacity group-hover:bg-foreground/35" />
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <Play className="h-7 w-7 fill-current" />
          </div>
        </button>
      )}
    </div>
  );
}

