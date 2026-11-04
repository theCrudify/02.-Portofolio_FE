'use client';

import { ArrowRight, Download, FileText, Images, Sparkles, ZoomIn } from 'lucide-react';
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

  const heroImages = [
    {
      id: 'hero-avatar',
      url: profile.avatar?.url ?? DEFAULT_AVATAR_URI,
      alt: profile.avatar?.alt || profile.name,
      title: profile.name,
      caption: profile.headline,
      category: 'Profile',
    },
    ...PORTFOLIO_SHOWCASE_IMAGES.slice(0, 4),
  ];

  const activeSlide = heroImages[activeSlideIndex] ?? heroImages[0];

  return (
    <AuroraBackground className="border-b border-border/50">
      <section id="hero" className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <AnimatedReveal direction="up" className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-xs backdrop-blur-sm">
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

              <div className="space-y-4">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t('eyebrow')}</span>
                </p>
                <h1 className="font-heading text-[40px] font-bold leading-[1.08] tracking-tight text-foreground md:text-[60px]">
                  {profile.name}
                </h1>
                <p className="max-w-[65ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {profile.headline}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md py-2">
                <SpotlightCard className="p-3.5">
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stats.yearsExperience}+
                  </p>
                  <p className="text-xs text-muted-foreground">{t('yearsExp')}</p>
                </SpotlightCard>
                <SpotlightCard className="p-3.5">
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stats.projectCount}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('projects')}</p>
                </SpotlightCard>
                <SpotlightCard className="p-3.5">
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                    {stats.certificationCount}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('certifications')}</p>
                </SpotlightCard>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'w-full sm:w-auto',
                  )}
                >
                  <span>{t('contactMe')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimatedReveal>

            <AnimatedReveal direction="left" delayMs={120} className="lg:col-span-5">
              <div className="space-y-3">
                <SpotlightCard tilt className="overflow-hidden p-2">
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="group relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Image
                      src={activeSlide.url}
                      alt={activeSlide.alt}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/15 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <Badge variant="secondary" className="bg-background/85 backdrop-blur-xs">
                        {activeSlide.category}
                      </Badge>
                      <span className="inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-xs">
                        <Images className="h-3 w-3 text-primary" />
                        {activeSlideIndex + 1} / {heroImages.length}
                      </span>
                    </div>
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                      <div>
                        <p className="font-heading text-sm font-semibold text-foreground">
                          {activeSlide.title}
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {activeSlide.caption}
                        </p>
                      </div>
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur-xs">
                        <ZoomIn className="h-4 w-4" />
                      </span>
                    </div>
                  </button>
                </SpotlightCard>

                {/* Multi-Image Thumbnail Switcher Strip */}
                <div className="grid grid-cols-5 gap-2">
                  {heroImages.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      aria-label={`Preview visual ${idx + 1}: ${img.title}`}
                      className={cn(
                        'relative aspect-video overflow-hidden rounded-md border transition-all',
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
              </div>
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
