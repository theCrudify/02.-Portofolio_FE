'use client';

import {
  Activity,
  ArrowRight,
  Download,
  FileText,
  Images,
  Layers,
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

  return (
    <AuroraBackground className="border-b border-border/80">
      <section id="hero" className="py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
            <AnimatedReveal
              direction="up"
              className={cn(
                'flex flex-col justify-between space-y-6 rounded-2xl border border-border/80 bg-card/75 p-6 shadow-sm backdrop-blur-md md:p-8',
                activeSlide ? 'lg:col-span-7' : 'lg:col-span-12',
              )}
            >
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground">
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
                    <Badge variant="outline" className="font-mono text-xs">
                      {profile.location}
                    </Badge>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t('eyebrow')}</span>
                  </p>
                  <h1 className="font-heading text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[56px]">
                    {profile.name}
                  </h1>
                  <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                    {profile.headline}
                  </p>
                </div>

                {profile.interests && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.interests.map((interest, idx) => (
                      <Badge key={`${interest.label}-${idx}`} variant="secondary" className="px-3 py-1">
                        {interest.label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stats.yearsExperience}+
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t('yearsExp')}</p>
                </SpotlightCard>

                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stats.projectCount}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t('projects')}</p>
                </SpotlightCard>

                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="h-4 w-4 text-success" />
                  </div>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stats.certificationCount}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t('certifications')}</p>
                </SpotlightCard>
              </div>

              <div className="flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
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
            </AnimatedReveal>

            {activeSlide ? (
              <AnimatedReveal
                direction="left"
                delay={0.1}
                className="flex flex-col justify-between space-y-4 lg:col-span-5"
              >
                <SpotlightCard interactiveTilt className="relative flex-1 overflow-hidden p-3">
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="group relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Image
                      src={activeSlide.url}
                      alt={activeSlide.alt}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 560px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/15 to-transparent" />

                    {heroImages.length > 1 ? (
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 font-mono text-xs font-medium text-foreground backdrop-blur-md">
                          <Images className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {activeSlideIndex + 1} / {heroImages.length}
                          </span>
                        </span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground shadow-sm backdrop-blur-md">
                          <ZoomIn className="h-4 w-4" />
                        </span>
                      </div>
                    ) : null}

                    <div className="absolute inset-x-3 bottom-3 space-y-0.5">
                      <p className="font-heading text-base font-bold text-foreground">
                        {activeSlide.title}
                      </p>
                      {activeSlide.caption ? (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
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
              </AnimatedReveal>
            ) : null}
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
