'use client';

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Download,
  FileText,
  Globe2,
  Images,
  Layers,
  MapPin,
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
import { buttonVariants } from '@/components/ui/button';
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

  return (
    <AuroraBackground className="border-b border-border/80">
      <section
        id="hero"
        className="relative flex min-h-[calc(100vh-4.5rem)] items-center py-8 md:py-12 lg:py-14"
      >
        <Container>
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
            <AnimatedReveal
              direction="up"
              className="flex flex-col justify-between space-y-6 rounded-2xl border border-border/80 bg-card/85 p-6 shadow-md backdrop-blur-md sm:p-8 lg:col-span-7"
            >
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border/60 pb-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        profile.availability !== 'not_available'
                          ? 'animate-pulse bg-success'
                          : 'bg-muted-foreground',
                      )}
                    />
                    <span>
                      {availabilityLabel} · {workPrefLabel} · {profile.timezone}
                    </span>
                  </div>

                  {profile.location ? (
                    <Badge variant="outline" className="gap-1.5 bg-background/80 font-mono text-xs">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span>{profile.location}</span>
                    </Badge>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t('eyebrow')}</span>
                  </p>
                  <h1 className="font-heading text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-[52px]">
                    {profile.name}
                  </h1>
                  <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {profile.headline}
                  </p>
                </div>

                {profile.interests && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.interests.map((interest, idx) => (
                      <Badge
                        key={`${interest.label}-${idx}`}
                        variant="secondary"
                        className="border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {interest.label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <SpotlightCard className="bg-background/60 p-3.5 sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                        <Activity className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-2.5 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                      {stats.yearsExperience}+
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {t('yearsExp')}
                    </p>
                  </SpotlightCard>

                  <SpotlightCard className="bg-background/60 p-3.5 sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                        <Layers className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-2.5 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                      {stats.projectCount}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {t('projects')}
                    </p>
                  </SpotlightCard>

                  <SpotlightCard className="bg-background/60 p-3.5 sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-success/30 bg-success/10 text-success">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-2.5 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                      {stats.certificationCount}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {t('certifications')}
                    </p>
                  </SpotlightCard>
                </div>

                <div className="flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
                    {showUploadedCv ? (
                      <Link
                        href="/cv"
                        onClick={() => track('cv_download', { target: `cv-${locale}` })}
                        className={cn(
                          buttonVariants({ variant: 'default', size: 'lg' }),
                          'w-full sm:w-auto shadow-sm',
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
                          'w-full sm:w-auto',
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
                        'w-full sm:w-auto',
                      )}
                    >
                      <span>{t('contactMe')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedReveal>

            <AnimatedReveal
              direction="left"
              delay={0.1}
              className="flex flex-col justify-between lg:col-span-5"
            >
              {activeSlide ? (
                <div className="relative flex h-full flex-col justify-between">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2 -z-10 rotate-2 rounded-2xl border border-primary/20 bg-primary/5"
                  />
                  <SpotlightCard
                    interactiveTilt
                    className="relative flex h-full flex-col justify-between overflow-hidden p-3.5 sm:p-4"
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="group relative aspect-4/3 w-full flex-1 overflow-hidden rounded-xl border border-border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Image
                        src={activeSlide.url}
                        alt={activeSlide.alt}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 560px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        {heroImages.length > 1 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 font-mono text-xs font-medium text-foreground backdrop-blur-md">
                            <Images className="h-3.5 w-3.5 text-primary" />
                            <span>
                              {activeSlideIndex + 1} / {heroImages.length}
                            </span>
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground shadow-sm backdrop-blur-md">
                          <ZoomIn className="h-4 w-4" />
                        </span>
                      </div>

                      <div className="absolute inset-x-3 bottom-3 rounded-xl border border-border/70 bg-background/85 p-3 backdrop-blur-md">
                        <p className="font-heading text-sm font-bold text-foreground sm:text-base">
                          {activeSlide.title}
                        </p>
                        {activeSlide.caption ? (
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {activeSlide.caption}
                          </p>
                        ) : null}
                      </div>
                    </button>

                    {heroImages.length > 1 ? (
                      <div className="mt-3 grid grid-cols-5 gap-2">
                        {heroImages.slice(0, 5).map((img, idx) => (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => setActiveSlideIndex(idx)}
                            aria-label={img.title}
                            className={cn(
                              'relative aspect-video overflow-hidden rounded-lg border transition-all',
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
                    ) : null}
                  </SpotlightCard>
                </div>
              ) : (
                <SpotlightCard
                  interactiveTilt
                  className="bg-dot-matrix relative flex h-full min-h-[380px] flex-col justify-between overflow-hidden p-6 sm:p-7"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
                  >
                    <div
                      className="h-72 w-72 rounded-full opacity-25 blur-3xl"
                      style={{
                        background:
                          'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                      }}
                    />
                    <svg
                      viewBox="0 0 360 360"
                      className="absolute h-72 w-72 text-primary/25 sm:h-80 sm:w-80"
                      fill="none"
                    >
                      <circle
                        cx="180"
                        cy="180"
                        r="150"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="6 6"
                      />
                      <circle
                        cx="180"
                        cy="180"
                        r="112"
                        stroke="currentColor"
                        strokeWidth="1.25"
                      />
                      <circle
                        cx="180"
                        cy="180"
                        r="74"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="3 5"
                      />
                      <line
                        x1="180"
                        y1="12"
                        x2="180"
                        y2="348"
                        stroke="currentColor"
                        strokeWidth="0.75"
                      />
                      <line
                        x1="12"
                        y1="180"
                        x2="348"
                        y2="180"
                        stroke="currentColor"
                        strokeWidth="0.75"
                      />
                      <circle cx="180" cy="30" r="4" fill="currentColor" />
                      <circle cx="292" cy="180" r="4" fill="currentColor" />
                      <circle cx="68" cy="180" r="3" fill="currentColor" />
                      <circle cx="180" cy="292" r="3.5" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 font-mono text-xs font-medium text-foreground shadow-2xs backdrop-blur-md">
                      <Compass className="h-3.5 w-3.5 text-primary" />
                      <span>{workPrefLabel}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 font-mono text-xs font-medium text-foreground shadow-2xs backdrop-blur-md">
                      <Globe2 className="h-3.5 w-3.5 text-primary" />
                      <span>{profile.timezone}</span>
                    </span>
                  </div>

                  <div className="relative z-10 my-6 flex flex-col items-center justify-center text-center">
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-primary/40 bg-background/90 shadow-xl backdrop-blur-xl sm:h-32 sm:w-32">
                      <div
                        aria-hidden="true"
                        className="absolute -inset-2 rounded-3xl border border-primary/20"
                      />
                      <span className="font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                        {initials}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3 rounded-xl border border-border/80 bg-background/90 p-4 shadow-sm backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-heading text-base font-bold text-foreground">
                        {profile.name}
                      </p>
                      {profile.location ? (
                        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>{profile.location}</span>
                        </span>
                      ) : null}
                    </div>

                    {socialEntries.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 border-t border-border/70 pt-2.5">
                        {socialEntries.slice(0, 4).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium capitalize text-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            <span>{platform}</span>
                            <ArrowUpRight className="h-3 w-3" />
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
