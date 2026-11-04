'use client';

import {
  Activity,
  ArrowRight,
  Cpu,
  Download,
  FileText,
  Globe,
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
import type { PublicProfile, PublicSiteSettings } from '@/lib/api/types';
import { track } from '@/lib/events';
import { cn } from '@/lib/utils';
import { DEFAULT_AVATAR_URI, PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

export interface HeroSectionProps {
  profile: PublicProfile | null;
  settings: PublicSiteSettings;
  stats: {
    yearsExperience: number;
    projectCount: number;
    certificationCount: number;
  };
  locale: 'en' | 'id';
}

export function HeroSection({ profile, settings, stats, locale }: HeroSectionProps) {
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

  const defaultSlide = {
    id: 'hero-avatar',
    url: profile.avatar?.url ?? DEFAULT_AVATAR_URI,
    alt: profile.avatar?.alt || profile.name,
    title: profile.name,
    caption: profile.headline,
    category: 'Profile',
  };

  const heroImages = [defaultSlide, ...PORTFOLIO_SHOWCASE_IMAGES.slice(0, 5)];
  const activeSlide = heroImages[activeSlideIndex] ?? defaultSlide;
  const secondarySlide = heroImages[(activeSlideIndex + 1) % heroImages.length] ?? defaultSlide;

  return (
    <AuroraBackground className="border-b border-border/80">
      <section id="hero" className="py-10 md:py-16 lg:py-20">
        <Container className="space-y-8">
          {/* Top Full-Width Architectural Telemetry Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/80 px-4 py-2.5 text-xs backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 font-medium text-foreground">
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
              </span>
              <span className="hidden h-3.5 w-px bg-border sm:inline-block" />
              <span className="hidden items-center gap-1.5 font-mono text-muted-foreground sm:inline-flex">
                <Cpu className="h-3.5 w-3.5 text-primary" />
                <span>ARCH: 8-DOMAIN ACTION OOP</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-success" />
                <span>p95: 11.4ms</span>
              </span>
              <span className="hidden h-3.5 w-px bg-border md:inline-block" />
              <span className="hidden items-center gap-1 md:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>ZERO-JSON QUERY</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
            {/* Left 7 Columns: Editorial Display + Bento Metrics + Stack */}
            <AnimatedReveal
              direction="up"
              className="flex flex-col justify-between space-y-6 rounded-2xl border border-border/80 bg-card/75 p-6 shadow-sm backdrop-blur-md md:p-8 lg:col-span-7"
            >
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t('eyebrow')}</span>
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {profile.location ?? 'Jakarta, ID'}
                  </Badge>
                </div>

                <h1 className="font-heading text-4xl font-bold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[56px]">
                  {profile.name}
                </h1>

                <p className="max-w-[64ch] text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                  {profile.headline}
                </p>

                {/* Architectural Domain Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Distributed Edge Systems',
                    'Fullstack TypeScript & Go',
                    'High-Throughput PostgreSQL',
                    'Interactive Design Systems',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground"
                    >
                      <Layers className="h-3 w-3 text-primary" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 4-Card Bento KPI Strip */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">EXP</span>
                    <Activity className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stats.yearsExperience}+
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t('yearsExp')}</p>
                </SpotlightCard>

                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">SHIP</span>
                    <Layers className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stats.projectCount}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t('projects')}</p>
                </SpotlightCard>

                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">CERT</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  </div>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stats.certificationCount}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t('certifications')}</p>
                </SpotlightCard>

                <SpotlightCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">EDGE</span>
                    <Globe className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                    48.5k
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Req/sec Peak</p>
                </SpotlightCard>
              </div>

              {/* Action CTA Bar */}
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

            {/* Right 5 Columns: Multi-Image Interactive Command Deck */}
            <AnimatedReveal
              direction="left"
              delay={0.1}
              className="flex flex-col justify-between space-y-4 lg:col-span-5"
            >
              <SpotlightCard interactiveTilt className="relative flex-1 overflow-hidden p-3">
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      VISUAL_DECK // 0{activeSlideIndex + 1}
                    </span>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs uppercase">
                    {activeSlide.category}
                  </Badge>
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="group relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3 py-1 font-mono text-xs font-medium text-foreground backdrop-blur-md">
                      <Images className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {activeSlideIndex + 1} / {heroImages.length} Visuals
                      </span>
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground shadow-sm backdrop-blur-md transition-transform group-hover:scale-110">
                      <ZoomIn className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Picture-in-Picture Floating Next Preview */}
                  <div className="absolute right-3 bottom-16 hidden w-32 overflow-hidden rounded-lg border border-primary/40 bg-background/90 p-1 shadow-lg backdrop-blur-md sm:block">
                    <div className="relative aspect-video w-full overflow-hidden rounded">
                      <Image
                        src={secondarySlide.url}
                        alt={secondarySlide.alt}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-1 truncate px-1 font-mono text-[10px] text-muted-foreground">
                      NEXT: {secondarySlide.title}
                    </p>
                  </div>

                  <div className="absolute inset-x-3 bottom-3 space-y-1">
                    <p className="font-heading text-base font-bold text-foreground sm:text-lg">
                      {activeSlide.title}
                    </p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {activeSlide.caption}
                    </p>
                  </div>
                </button>

                {/* 6-Image Bento Thumbnail Switcher */}
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {heroImages.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      aria-label={`Preview visual ${idx + 1}: ${img.title}`}
                      className={cn(
                        'relative aspect-video overflow-hidden rounded-lg border transition-all',
                        idx === activeSlideIndex
                          ? 'border-primary ring-2 ring-primary/40 scale-[1.03]'
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
              </SpotlightCard>
            </AnimatedReveal>
          </div>
        </Container>
      </section>

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
          <div className="flex gap-2 overflow-x-auto pb-1">
            {heroImages.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={cn(
                  'relative h-14 w-24 shrink-0 overflow-hidden rounded-md border transition-all',
                  idx === activeSlideIndex
                    ? 'border-primary ring-2 ring-primary'
                    : 'border-border opacity-60 hover:opacity-100',
                )}
              >
                <Image src={img.url} alt={img.alt} fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </Dialog>
    </AuroraBackground>
  );
}
