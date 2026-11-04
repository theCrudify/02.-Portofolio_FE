'use client';

import { useEffect, useRef } from 'react';

export interface VideoClipProps {
  url: string;
  sources?: { mp4: string; webm: string };
  poster?: string | null;
  className?: string;
}

export function VideoClip({ url, sources, poster, className }: VideoClipProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      poster={poster ?? undefined}
      className={className}
    >
      {sources ? (
        <>
          <source src={sources.webm} type="video/webm" />
          <source src={sources.mp4} type="video/mp4" />
        </>
      ) : (
        <source src={url} />
      )}
    </video>
  );
}
