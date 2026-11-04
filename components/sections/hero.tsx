'use client';

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Download,
  FileText,
  Images,
  Layers,
  MapPin,
  Radio,
  ShieldCheck,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AnimatedReveal } from '@/components/effects/animated-reveal';
import { AuroraBackground } from '@/components/effects/aurora-background';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Link } from '@/i18n/routing';
import type {
  PublicProfile,
  PublicProjectCard,
  PublicSiteSettings,
} from '@/lib/api/types';
import { track } from '@/lib/events';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  profile: PublicProfile | null;
  settings: PublicSiteSettings;
  stats: {
    yearsExperience: number;
    projectCount: number;
    certificationCount: number;
  };
  locale: 'en' | 'id';
  projects?: PublicProjectCard[];
}

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'PF';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

export function HeroSection({
  profile,
  settings,
  stats,
  locale,
  projects = [],
}: HeroSectionProps) {
  const t = useTranslations('hero');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [proceduralSlide, setProceduralSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!profile) return null;

  const availabilityLabel =
    profile.availability === 'open_to_work'
      ? t('openToWork')
      : profile.availability === 'freelance'
        ? t('freelance')
        : t('notAvailable');

  const workPrefLabel =
    profile.workPreference === 'remote'
      ? t('remote')
      : profile.workPreference === 'hybrid'
        ? t('hybrid')
        : t('onsite');

  const showUploadedCv =
    settings.heroCvButtons === 'uploaded' || settings.heroCvButtons === 'both';
  const showExportPdf =
    settings.heroCvButtons === 'export' || settings.heroCvButtons === 'both';

  const exportPresetSlug = locale === 'id' ? 'full-id' : 'full-en';

  const heroImages = [
    ...(profile.avatar
      ? [
          {
            id: 'hero-avatar',
            url: profile.avatar.url,
            alt: profile.avatar.alt || profile.name,
            title: profile.name,
            caption: profile.headline,
          },
        ]
      : []),
    ...projects
      .filter((p) => p.cover?.url)
      .map((p) => ({
        id: `hero-proj-${p.slug}`,
        url: p.cover!.url,
        alt: p.cover!.alt || p.title,
        title: p.title,
        caption: p.summary,
      })),
  ];

  const activeSlide = heroImages[activeSlideIndex] ?? heroImages[0] ?? null;
  const initials = getInitials(profile.name);
  const socialEntries = Object.entries(profile.socials ?? {}).filter(
    ([, url]) => typeof url === 'string' && url.length > 0,
  );

  const handlePrevHeroImage = () => {
    setActiveSlideIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleNextHeroImage = () => {
    setActiveSlideIndex((prev) => (prev + 1) % heroImages.length);
  };

  const handlePrevProcedural = () => {
    setProceduralSlide((prev) => (prev - 1 + 3) % 3);
  };

  const handleNextProcedural = () => {
    setProceduralSlide((prev) => (prev + 1) % 3);
  };

  return (
    <AuroraBackground className="border-b border-border/80">
      <section
        id="hero"
        className="relative flex min-h-[calc(100vh-4.5rem)] items-center py-10 md:py-14 lg:py-16"
      >
        <Container>
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
            {/* Left Column: Command & Identity Center */}
            <AnimatedReveal
              direction="up"
              className="flex flex-col justify-between space-y-8 rounded-3xl border border-border/80 bg-card/85 p-7 shadow-xl backdrop-blur-md sm:p-10 lg:col-span-7 xl:col-span-8 lg:p-12"
            >
              <div className="space-y-6">
                {/* Status & Location Pill Dock */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-foreground shadow-2xs">
                    <span
                      className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        profile.availability !== 'not_available'
                          ? 'animate-pulse bg-success shadow-[0_0_8px_currentColor]'
                          : 'bg-muted-foreground',
                      )}
                    />
                    <span>
                      {availabilityLabel} · {workPrefLabel} · {profile.timezone}
                    </span>
                  </div>

                  {profile.location ? (
                    <Badge variant="outline" className="gap-1.5 bg-background/80 px-3.5 py-1.5 font-mono text-xs shadow-2xs">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{profile.location}</span>
                    </Badge>
                  ) : null}
                </div>

                {/* Display Typography */}
                <div className="space-y-3">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span>{t('eyebrow')}</span>
                  </p>
                  <h1 className="font-heading text-4xl font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[76px]">
                    {profile.name}
                  </h1>
                  <p className="max-w-3xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
                    {profile.headline}
                  </p>
                </div>

                {profile.interests && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {profile.interests.map((interest, idx) => (
                      <Badge
                        key={`${interest.label}-${idx}`}
                        variant="secondary"
                        className="border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-2xs"
                      >
                        {interest.label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Stats Bar & High-Contrast CTAs */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3.5 sm:gap-4">
                  <SpotlightCard interactiveTilt className="bg-background/70 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-2xs">
                        <Activity className="h-4.5 w-4.5" />
                      </span>
                    </div>
                    <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                      {stats.yearsExperience}+
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t('yearsExp')}
                    </p>
                  </SpotlightCard>

                  <SpotlightCard interactiveTilt className="bg-background/70 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-2xs">
                        <Layers className="h-4.5 w-4.5" />
                      </span>
                    </div>
                    <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                      {stats.projectCount}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t('projects')}
                    </p>
                  </SpotlightCard>

                  <SpotlightCard interactiveTilt className="bg-background/70 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-success/30 bg-success/10 text-success shadow-2xs">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </span>
                    </div>
                    <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                      {stats.certificationCount}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t('certifications')}
                    </p>
                  </SpotlightCard>
                </div>

                <div className="flex flex-col gap-3.5 border-t border-border/80 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
                  {showUploadedCv ? (
                    <Link
                      href="/cv"
                      onClick={() => track('cv_download', { target: `cv-${locale}` })}
                      className={cn(
                        buttonVariants({ variant: 'default', size: 'lg' }),
                        'h-12 w-full px-6 font-semibold shadow-md sm:w-auto',
                      )}
                    >
                      <Download className="h-4 w-4" />
                      <span>{t('downloadCv')}</span>
                    </Link>
                  ) : null}

                  {showExportPdf ? (
                    <a
                      href={`/api/pdf/${exportPresetSlug}?locale=${locale}`}
                      onClick={() =>
                        track('export_download', { target: exportPresetSlug })
                      }
                      className={cn(
                        buttonVariants({
                          variant: showUploadedCv ? 'outline' : 'default',
                          size: 'lg',
                        }),
                        'h-12 w-full px-6 font-semibold sm:w-auto',
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      <span>{t('fullProfilePdf')}</span>
                    </a>
                  ) : null}

                  <Link
                    href="/#contact"
                    className={cn(
                      buttonVariants({ variant: 'secondary', size: 'lg' }),
                      'h-12 w-full px-6 font-semibold sm:w-auto',
                    )}
                  >
                    <span>{t('contactMe')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </AnimatedReveal>

            {/* Right Column: 3D Stage & Visual Artifact Deck */}
            <AnimatedReveal
              direction="left"
              delay={0.1}
              className="flex flex-col justify-between lg:col-span-5 xl:col-span-4"
            >
              {activeSlide ? (
                <div className="relative flex h-full min-h-[500px] flex-col justify-between">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2.5 -z-10 rotate-1.5 rounded-3xl border border-primary/20 bg-primary/5"
                  />
                  <SpotlightCard
                    interactiveTilt
                    className="relative flex h-full flex-col justify-between overflow-hidden p-4 sm:p-5"
                  >
                    <div className="group relative aspect-4/3 w-full flex-1 overflow-hidden rounded-2xl border border-border bg-muted">
                      <Image
                        src={activeSlide.url}
                        alt={activeSlide.alt}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/25 to-transparent" />

                      {/* Header overlay with slide counter & zoom */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                        {heroImages.length > 1 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3.5 py-1.5 font-mono text-xs font-bold text-foreground backdrop-blur-md">
                            <Images className="h-3.5 w-3.5 text-primary" />
                            <span>
                              {activeSlideIndex + 1} / {heroImages.length}
                            </span>
                          </span>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          onClick={() => setLightboxOpen(true)}
                          aria-label="Zoom image"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-md backdrop-blur-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Floating Directional Slide Arrows */}
                      {heroImages.length > 1 ? (
                        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handlePrevHeroImage}
                            aria-label={t('slidePrev')}
                            className="pointer-events-auto h-10 w-10 rounded-full border-primary/30 bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-primary"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleNextHeroImage}
                            aria-label={t('slideNext')}
                            className="pointer-events-auto h-10 w-10 rounded-full border-primary/30 bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-primary"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      ) : null}

                      {/* Caption box */}
                      <div className="absolute inset-x-3.5 bottom-3.5 rounded-2xl border border-border/70 bg-background/90 p-4 backdrop-blur-md">
                        <p className="font-heading text-base font-bold text-foreground sm:text-lg">
                          {activeSlide.title}
                        </p>
                        {activeSlide.caption ? (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                            {activeSlide.caption}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Thumbnail Dock & Slide Indicators */}
                    {heroImages.length > 1 ? (
                      <div className="mt-4 space-y-2.5">
                        <div className="grid grid-cols-5 gap-2">
                          {heroImages.slice(0, 5).map((img, idx) => (
                            <button
                              key={img.id}
                              type="button"
                              onClick={() => setActiveSlideIndex(idx)}
                              aria-label={img.title}
                              className={cn(
                                'relative aspect-video overflow-hidden rounded-xl border transition-all',
                                idx === activeSlideIndex
                                  ? 'border-primary ring-2 ring-primary/40 scale-[1.02]'
                                  : 'border-border opacity-70 hover:opacity-100',
                              )}
                            >
                              <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>

                        {/* Slide Indicator Dots */}
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          {heroImages.map((img, idx) => (
                            <button
                              key={`dot-${img.id}`}
                              type="button"
                              onClick={() => setActiveSlideIndex(idx)}
                              aria-label={`Slide ${idx + 1}`}
                              className={cn(
                                'h-2 rounded-full transition-all duration-300',
                                idx === activeSlideIndex
                                  ? 'w-7 bg-primary shadow-xs'
                                  : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/80',
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </SpotlightCard>
                </div>
              ) : (
                /* Interactive 3D Multi-Slide Procedural Deck */
                <SpotlightCard
                  interactiveTilt
                  className="bg-dot-matrix relative flex h-full min-h-[500px] flex-col justify-between overflow-hidden p-6 sm:p-8"
                >
                  {/* Procedural Header with Slide Controller & Directional Buttons */}
                  <div className="relative z-10 flex items-center justify-between gap-3 border-b border-border/70 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                      <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                        {proceduralSlide === 0
                          ? '// 01 TELEMETRY RADAR'
                          : proceduralSlide === 1
                            ? '// 02 SPATIAL IDENTITY'
                            : '// 03 CAPABILITIES & ARSENAL'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-muted-foreground">
                        {String(proceduralSlide + 1).padStart(2, '0')} / 03
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handlePrevProcedural}
                        aria-label={t('slidePrev')}
                        className="h-8 w-8 rounded-lg shadow-2xs hover:scale-105"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleNextProcedural}
                        aria-label={t('slideNext')}
                        className="h-8 w-8 rounded-lg shadow-2xs hover:scale-105"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Procedural Slide Content with 3D Depth */}
                  <div className="relative z-10 my-8 flex flex-1 items-center justify-center">
                    {proceduralSlide === 0 ? (
                      /* Slide 0: Telemetry Radar */
                      <div className="relative flex flex-col items-center justify-center text-center">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute h-72 w-72 rounded-full opacity-30 blur-3xl"
                          style={{
                            background:
                              'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                          }}
                        />
                        <svg
                          viewBox="0 0 360 360"
                          className="h-68 w-68 text-primary/35 transition-transform duration-700 hover:rotate-45 sm:h-76 sm:w-76"
                          fill="none"
                        >
                          <circle
                            cx="180"
                            cy="180"
                            r="150"
                            stroke="currentColor"
                            strokeWidth="1.25"
                            strokeDasharray="6 6"
                          />
                          <circle
                            cx="180"
                            cy="180"
                            r="110"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx="180"
                            cy="180"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="1.25"
                            strokeDasharray="3 5"
                          />
                          <line
                            x1="180"
                            y1="15"
                            x2="180"
                            y2="345"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                          <line
                            x1="15"
                            y1="180"
                            x2="345"
                            y2="180"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                          <circle cx="180" cy="30" r="4.5" fill="currentColor" />
                          <circle cx="290" cy="180" r="4.5" fill="currentColor" />
                          <circle cx="70" cy="180" r="3.5" fill="currentColor" />
                          <circle cx="180" cy="290" r="4" fill="currentColor" />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-background/90 text-primary shadow-xl backdrop-blur-md">
                            <Radio className="h-7 w-7 animate-pulse" />
                          </span>
                          <span className="mt-3 font-mono text-sm font-bold text-foreground">
                            {profile.timezone}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            {workPrefLabel}
                          </span>
                        </div>
                      </div>
                    ) : proceduralSlide === 1 ? (
                      /* Slide 1: 3D Spatial Monogram */
                      <div className="relative flex flex-col items-center justify-center text-center">
                        <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border-2 border-primary/40 bg-background/90 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:rotate-6 sm:h-44 sm:w-44">
                          <div
                            aria-hidden="true"
                            className="absolute -inset-3 rounded-3xl border border-primary/25"
                          />
                          <span className="font-heading text-5xl font-black tracking-tight text-primary sm:text-6xl">
                            {initials}
                          </span>
                        </div>
                        <p className="mt-5 font-heading text-lg font-bold text-foreground sm:text-xl">
                          {profile.name}
                        </p>
                        {profile.location ? (
                          <span className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            <span>{profile.location}</span>
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      /* Slide 2: Capabilities & Stack Radar */
                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-background/85 p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-2xs">
                              <Cpu className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {profile.headline}
                            </span>
                          </div>
                          <Badge variant="outline" className="font-mono text-xs">
                            {stats.yearsExperience}+ YRS
                          </Badge>
                        </div>

                        {profile.interests && profile.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {profile.interests.map((item, idx) => (
                              <Badge
                                key={`proc-int-${idx}`}
                                variant="secondary"
                                className="border border-border/70 px-3 py-1 text-xs"
                              >
                                {item.label}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Procedural Footer with Slide Indicators & Quick Details */}
                  <div className="relative z-10 space-y-3.5 rounded-2xl border border-border/80 bg-background/90 p-4 shadow-sm backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {[0, 1, 2].map((idx) => (
                          <button
                            key={`proc-dot-${idx}`}
                            type="button"
                            onClick={() => setProceduralSlide(idx)}
                            aria-label={`Slide ${idx + 1}`}
                            className={cn(
                              'h-2 rounded-full transition-all duration-300',
                              idx === proceduralSlide
                                ? 'w-8 bg-primary shadow-xs'
                                : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/80',
                            )}
                          />
                        ))}
                      </div>

                      {profile.location ? (
                        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{profile.location}</span>
                        </span>
                      ) : null}
                    </div>

                    {socialEntries.length > 0 ? (
                      <div className="flex flex-wrap gap-2 border-t border-border/70 pt-3">
                        {socialEntries.slice(0, 4).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold capitalize text-foreground shadow-2xs transition-colors hover:border-primary hover:text-primary"
                          >
                            <span>{platform}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </SpotlightCard>
              )}
            </AnimatedReveal>
          </div>
        </Container>
      </section>

      {activeSlide ? (
        <Dialog
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          title={activeSlide.title}
          description={activeSlide.caption}
          className="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={activeSlide.url}
                alt={activeSlide.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </Dialog>
      ) : null}
    </AuroraBackground>
  );
}
