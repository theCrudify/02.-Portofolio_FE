'use client';

import * as React from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Columns2,
  GalleryHorizontal,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { CertificationCard } from '@/components/sections/certification-card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type { PublicCertification, SupportedLocale } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface CertificationsSectionProps {
  certifications: PublicCertification[];
  locale: SupportedLocale;
  muted?: boolean;
}

type ViewMode = 'slide' | 'grid';

export function CertificationsSection({
  certifications,
  locale,
  muted,
}: CertificationsSectionProps) {
  const t = useTranslations('sections.certifications');

  // Filter state
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [viewMode, setViewMode] = React.useState<ViewMode>('slide');
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(4);
  const [pageIndex, setPageIndex] = React.useState<number>(0);

  if (!certifications || certifications.length === 0) return null;

  // Extract unique credential types with their counts
  const typeMap = new Map<string, { code: string; label: string; count: number }>();
  certifications.forEach((c) => {
    const existing = typeMap.get(c.type.code);
    if (existing) {
      existing.count += 1;
    } else {
      typeMap.set(c.type.code, { code: c.type.code, label: c.type.label, count: 1 });
    }
  });
  const availableTypes = Array.from(typeMap.values());

  // Filtered list
  const filtered =
    selectedType === 'all'
      ? certifications
      : certifications.filter((c) => c.type.code === selectedType);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Reset page index when filter or itemsPerPage changes
  const handleTypeSelect = (typeCode: string) => {
    setSelectedType(typeCode);
    setPageIndex(0);
  };

  const handlePerPageChange = (size: number) => {
    setItemsPerPage(size);
    setPageIndex(0);
  };

  const handlePrev = () => {
    setPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setPageIndex((prev) => (prev + 1) % totalPages);
  };

  // Keyboard navigation for slide mode
  React.useEffect(() => {
    if (viewMode !== 'slide' || totalPages <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewMode, totalPages]);

  // Current page items
  const startIdx = pageIndex * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, totalItems);
  const currentItems = filtered.slice(startIdx, endIdx);

  return (
    <Section
      id="certifications"
      eyebrow={t('eyebrow')}
      title={t('title')}
      muted={muted}
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="secondary"
            className="gap-1.5 border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{certifications.length} {t('title')}</span>
          </Badge>
          <Link href="/certifications" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            <span>{t('viewAll')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Customization Toolbar: Type Filters, View Mode & Slide / Pagination Controls */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/85 p-3.5 shadow-sm backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleTypeSelect('all')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                selectedType === 'all'
                  ? 'border border-primary/30 bg-primary text-primary-foreground shadow-xs'
                  : 'border border-border/60 bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span>{t('all')}</span>
              <span className="font-mono text-[10px] opacity-80">({certifications.length})</span>
            </button>

            {availableTypes.map((type) => (
              <button
                key={type.code}
                type="button"
                onClick={() => handleTypeSelect(type.code)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                  selectedType === type.code
                    ? 'border border-primary/30 bg-primary text-primary-foreground shadow-xs'
                    : 'border border-border/60 bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span>{type.label}</span>
                <span className="font-mono text-[10px] opacity-80">({type.count})</span>
              </button>
            ))}
          </div>

          {/* Right Controls: Mode (Slide vs Grid), Per Page, & Directional Slide Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex items-center rounded-xl border border-border/70 bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => setViewMode('slide')}
                aria-label={t('slider')}
                title={t('slider')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                  viewMode === 'slide'
                    ? 'border border-primary/30 bg-background text-primary shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <GalleryHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('slider')}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label={t('grid')}
                title={t('grid')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                  viewMode === 'grid'
                    ? 'border border-primary/30 bg-background text-primary shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('grid')}</span>
              </button>
            </div>

            {/* Items Per View Selector */}
            <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
              <Columns2 className="h-3.5 w-3.5" />
              <span>{t('perPage')}:</span>
              <div className="inline-flex items-center rounded-lg border border-border/70 bg-background p-0.5">
                {[2, 4, 6].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handlePerPageChange(size)}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold transition-all',
                      itemsPerPage === size
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons & Page Counter */}
            {totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-primary">
                  {String(pageIndex + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    aria-label={t('prev')}
                    className="h-8 w-8 rounded-lg shadow-2xs transition-transform hover:scale-105"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    aria-label={t('next')}
                    className="h-8 w-8 rounded-lg shadow-2xs transition-transform hover:scale-105"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Status / Showing telemetry */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <p>
            {t('showing', {
              start: totalItems > 0 ? startIdx + 1 : 0,
              end: endIdx,
              total: totalItems,
            })}
          </p>
          {viewMode === 'slide' && totalPages > 1 ? (
            <span className="hidden items-center gap-1 font-mono text-[11px] text-primary sm:inline-flex">
              <Sparkles className="h-3 w-3" />
              <span>Gunakan tombol panah keyboard ← → untuk menggeser</span>
            </span>
          ) : null}
        </div>

        {/* Content Area */}
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
            <ShieldCheck className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">{t('emptyFilter')}</p>
            <Button variant="outline" size="sm" onClick={() => handleTypeSelect('all')}>
              {t('all')}
            </Button>
          </div>
        ) : (
          <div
            key={`page-${pageIndex}-${selectedType}-${viewMode}`}
            className={cn(
              'grid gap-6 transition-all duration-300 animate-in fade-in-50',
              itemsPerPage === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : itemsPerPage === 6
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2',
            )}
          >
            {currentItems.map((cert) => (
              <CertificationCard key={cert.id} cert={cert} locale={locale} />
            ))}
          </div>
        )}

        {/* Bottom Navigation: Slider Dots or Paginated Numbers */}
        {totalPages > 1 ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            {viewMode === 'slide' ? (
              /* Slide Indicator Dots */
              <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-4 py-2 shadow-xs backdrop-blur-md">
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    type="button"
                    onClick={() => setPageIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={cn(
                      'h-2.5 rounded-full transition-all duration-300',
                      idx === pageIndex
                        ? 'w-8 bg-primary shadow-xs'
                        : 'w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/80',
                    )}
                  />
                ))}
              </div>
            ) : (
              /* Numbered Pagination Buttons */
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={pageIndex === 0}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>{t('prev')}</span>
                </Button>

                {Array.from({ length: totalPages }, (_, idx) => (
                  <Button
                    key={`page-btn-${idx}`}
                    type="button"
                    variant={idx === pageIndex ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPageIndex(idx)}
                    className="h-8 w-8 p-0 font-mono text-xs"
                  >
                    {idx + 1}
                  </Button>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={pageIndex === totalPages - 1}
                  className="gap-1 text-xs"
                >
                  <span>{t('next')}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
