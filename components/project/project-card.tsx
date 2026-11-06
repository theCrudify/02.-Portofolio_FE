'use client';

import { ArrowUpRight, Building2, ExternalLink, Images, Layers, Lock } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { VideoClip } from '@/components/media/video-clip';
import { TechLogo } from '@/components/project/tech-logo';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import type { PublicProjectCard } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface ProjectCardProps {
  project: PublicProjectCard;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations('sections.projects');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imageList =
    project.images && project.images.length > 0
      ? project.images
      : project.cover
        ? [project.cover]
        : [];

  const currentImage = imageList[activeImageIndex] ?? imageList[0] ?? null;

  return (
    <SpotlightCard className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* Browser-window chrome so every preview reads as a product screenshot */}
      <BrowserChrome path={`/${project.slug}`} />
      <div className="relative aspect-video w-full overflow-hidden border-b border-border/60 bg-muted">
        <Link
          href={`/projects/${project.slug}`}
          className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {project.clip && activeImageIndex === 0 ? (
            <VideoClip
              url={project.clip.url}
              sources={project.clip.sources}
              poster={project.cover?.url ?? project.clip.thumbnailUrl}
              className="h-full w-full object-cover"
            />
          ) : currentImage ? (
            <Image
              src={currentImage.url}
              alt={currentImage.alt || project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="bg-architectural-grid relative flex h-full w-full items-center justify-center overflow-hidden bg-muted/60">
              <div
                aria-hidden="true"
                className="absolute h-44 w-44 rounded-full opacity-30 blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/35 bg-background/90 shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Layers className="h-6 w-6 text-primary" />
                </span>
                <span className="line-clamp-2 max-w-[22ch] font-heading text-lg font-bold leading-snug text-foreground/80">
                  {project.title}
                </span>
              </div>
            </div>
          )}
        </Link>

        {imageList.length > 1 ? (
          <>
            <div className="pointer-events-none absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-xs backdrop-blur-xs">
              <Images className="h-3 w-3 text-primary" />
              <span>
                {activeImageIndex + 1}/{imageList.length}
              </span>
            </div>

            <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1.5 backdrop-blur-xs">
              {imageList.map((img, idx) => (
                <button
                  key={`${img.url}-${idx}`}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  aria-label={`Show image ${idx + 1} for ${project.title}`}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    idx === activeImageIndex
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-muted-foreground/50 hover:bg-foreground',
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {imageList.length > 1 ? (
        <div className="grid grid-cols-4 gap-1.5 border-b border-border/60 bg-muted/30 px-3 py-2">
          {imageList.slice(0, 4).map((img, idx) => (
            <button
              key={`thumb-${img.url}-${idx}`}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              aria-label={`Select preview ${idx + 1}`}
              className={cn(
                'relative aspect-video overflow-hidden rounded border transition-all',
                idx === activeImageIndex
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-border/60 opacity-65 hover:opacity-100',
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `${project.title} preview ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{project.type.label}</Badge>
          {project.state.code !== 'live' ? (
            <Badge variant="outline">{project.state.label}</Badge>
          ) : null}
        </div>
        <CardTitle className="line-clamp-1">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {project.title}
          </Link>
        </CardTitle>
        {project.client ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{project.client.name}</span>
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        {project.technologies.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((tech) => (
              <Badge
                key={tech.slug}
                variant="outline"
                className="gap-1.5 bg-background/80 text-xs font-normal"
              >
                <TechLogo name={tech.name} icon={tech.icon} className="h-4 w-4" />
                {tech.name}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 border-t border-border pt-4">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>{t('caseStudy')}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        {project.primaryLink ? (
          project.primaryLink.isPrivate || !project.primaryLink.url ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              {t('privateRepo')}
            </span>
          ) : (
            <a
              href={project.primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.primaryLink.label} – ${project.title}`}
              className="inline-flex min-h-11 items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{project.primaryLink.label}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )
        ) : null}
      </CardFooter>
    </SpotlightCard>
  );
}

/** Window-chrome bar (traffic lights + path) above product previews. */
export function BrowserChrome({ path, className }: { path: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('flex items-center gap-1.5 border-b border-border/60 bg-muted/70 px-3 py-2', className)}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
      <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-background/80 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        {path}
      </span>
    </div>
  );
}
