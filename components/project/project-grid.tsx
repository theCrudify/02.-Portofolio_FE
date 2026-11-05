'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  Columns3,
  Layers,
  RectangleHorizontal,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProjectCard } from '@/components/project/project-card';
import { Button } from '@/components/ui/button';
import type { PublicProjectCard } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface ProjectGridProps {
  projects: PublicProjectCard[];
}

type LayoutMode = '3d' | '1' | '2' | '3';

export function ProjectGrid({ projects }: ProjectGridProps) {
  const t = useTranslations('sections.projects');
  const [layoutMode, setLayoutMode] = React.useState<LayoutMode>('3d');
  const [activeSlideIndex, setActiveSlideIndex] = React.useState(0);

  if (!projects || projects.length === 0) {
    return null;
  }

  const projectCount = projects.length;

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + projectCount) % projectCount);
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % projectCount);
  };

  // Keyboard navigation for 3D carousel
  React.useEffect(() => {
    if (layoutMode !== '3d') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layoutMode, projectCount]);

  return (
    <div className="space-y-6">
      {/* Layout & Grid Column Customization Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/85 p-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('viewMode')}:
          </span>
          <div className="inline-flex items-center rounded-xl border border-border/70 bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setLayoutMode('3d')}
              aria-label={t('mode3d')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                layoutMode === '3d'
                  ? 'border border-primary/30 bg-background text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{t('mode3d')}</span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('1')}
              aria-label={t('modeGrid1')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                layoutMode === '1'
                  ? 'border border-primary/30 bg-background text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <RectangleHorizontal className="h-3.5 w-3.5" />
              <span>{t('modeGrid1')}</span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('2')}
              aria-label={t('modeGrid2')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                layoutMode === '2'
                  ? 'border border-primary/30 bg-background text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Columns2 className="h-3.5 w-3.5" />
              <span>{t('modeGrid2')}</span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('3')}
              aria-label={t('modeGrid3')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                layoutMode === '3'
                  ? 'border border-primary/30 bg-background text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Columns3 className="h-3.5 w-3.5" />
              <span>{t('modeGrid3')}</span>
            </button>
          </div>
        </div>

        {/* Directional Slide Controls & Pointer (Visible in 3D Mode) */}
        {layoutMode === '3d' && projectCount > 1 ? (
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-primary">
              {String(activeSlideIndex + 1).padStart(2, '0')} / {String(projectCount).padStart(2, '0')}
            </span>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePrevSlide}
                aria-label={t('slidePrev')}
                className="h-8 w-8 rounded-lg shadow-2xs transition-transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleNextSlide}
                aria-label={t('slideNext')}
                className="h-8 w-8 rounded-lg shadow-2xs transition-transform hover:scale-105"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <span className="font-mono text-xs text-muted-foreground">
            {projectCount} {t('title').toLowerCase()}
          </span>
        )}
      </div>

      {/* 3D Coverflow Slide Carousel Mode */}
      {layoutMode === '3d' ? (
        <div className="relative overflow-hidden px-2 py-8 sm:py-12 md:py-14">
          {/* 3D Perspective Viewport */}
          <div
            className="relative mx-auto flex min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] w-full max-w-5xl items-center justify-center px-4"
            style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          >
            {/* Natural flow spacer so parent container dynamically sizes to card content without cutting off */}
            <div
              aria-hidden="true"
              className="invisible pointer-events-none select-none w-full max-w-lg opacity-0"
              tabIndex={-1}
            >
              <ProjectCard project={projects[activeSlideIndex] ?? projects[0]!} />
            </div>

            {projects.map((project, idx) => {
              const diff = (idx - activeSlideIndex + projectCount) % projectCount;
              // Map diff to relative offset centered at 0: 0 is active, 1 is next, -1 is prev
              let offset = diff;
              if (diff > projectCount / 2) {
                offset = diff - projectCount;
              }

              const isCurrent = offset === 0;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible && projectCount > 4) {
                return null;
              }

              // 3D Matrix Transformations
              const rotateY = offset * -22;
              const translateX = offset * 58;
              const translateZ = isCurrent ? 50 : -90 * Math.abs(offset);
              const scale = isCurrent ? 1 : Math.max(0.78, 1 - Math.abs(offset) * 0.14);
              const opacity = isCurrent ? 1 : Math.max(0.35, 1 - Math.abs(offset) * 0.35);
              const zIndex = isCurrent ? 30 : 20 - Math.abs(offset);

              return (
                <div
                  key={project.slug}
                  onClick={() => {
                    if (!isCurrent) setActiveSlideIndex(idx);
                  }}
                  style={{
                    transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: 'all 500ms cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                  className={cn(
                    'absolute w-full max-w-lg cursor-pointer transition-all duration-500',
                    isCurrent
                      ? 'cursor-default ring-2 ring-primary/40 shadow-2xl'
                      : 'hover:opacity-85 [&_a]:pointer-events-none [&_button]:pointer-events-none',
                  )}
                >
                  <ProjectCard project={project} />
                </div>
              );
            })}
          </div>

          {/* Directional Slide Navigation Arrows Overlay */}
          {projectCount > 1 ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-40 flex items-center justify-between px-2 sm:px-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handlePrevSlide}
                aria-label={t('slidePrev')}
                className="pointer-events-auto h-11 w-11 rounded-full border-primary/30 bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleNextSlide}
                aria-label={t('slideNext')}
                className="pointer-events-auto h-11 w-11 rounded-full border-primary/30 bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          ) : null}

          {/* Slide Indicator Dots & Pointers */}
          {projectCount > 1 ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-4 py-2 shadow-xs backdrop-blur-md">
                {projects.map((proj, idx) => (
                  <button
                    key={`dot-${proj.slug}`}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    aria-label={`${proj.title} (Slide ${idx + 1})`}
                    className={cn(
                      'h-2.5 rounded-full transition-all duration-300',
                      idx === activeSlideIndex
                        ? 'w-8 bg-primary shadow-xs'
                        : 'w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/80',
                    )}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* Dynamic Grid Column Modes */
        <div
          className={cn(
            'grid gap-6 transition-all duration-300',
            layoutMode === '1' && 'mx-auto max-w-4xl grid-cols-1',
            layoutMode === '2' && 'grid-cols-1 md:grid-cols-2',
            layoutMode === '3' && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
