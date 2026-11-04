'use client';

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Download,
  FileText,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { AnimatedReveal } from '@/components/effects/animated-reveal';
import { AuroraBackground } from '@/components/effects/aurora-background';
import { CountUp } from '@/components/effects/count-up';
import { LaptopStage } from '@/components/effects/laptop-stage';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type {
  PublicProfile,
  PublicProjectCard,
  PublicSiteSettings,
  SiteData,
} from '@/lib/api/types';
import { pickExportPreset } from '@/lib/export-presets';
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
  exportPresets?: SiteData['exportPresets'];
  /** Technology names typed on the laptop screen. */
  stack?: string[];
}

const NO_STACK: string[] = [];
const NO_PRESETS: SiteData['exportPresets'] = [];

export function HeroSection({
  profile,
  settings,
  stats,
  locale,
  projects = [],
  stack = NO_STACK,
  exportPresets = NO_PRESETS,
}: HeroSectionProps) {
  const t = useTranslations('hero');
  const laptopImages = useMemo(
    () => projects.flatMap((p) => (p.cover?.url ? [p.cover.url] : [])),
    [projects],
  );
  const laptopCode = useMemo(
    () => ({
      name: profile?.name ?? '',
      role: profile?.headline ?? '',
      stack,
      location: profile?.location ?? null,
      available: profile?.availability.code !== 'not_available',
    }),
    [profile, stack],
  );

  if (!profile) return null;

  // Labels come from master data in the request's locale.
  const availabilityLabel = profile.availability.label;
  const workPrefLabel = profile.workPreference.label;

  const showUploadedCv =
    settings.heroCvButtons === 'uploaded' || settings.heroCvButtons === 'both';
  const showExportPdf =
    settings.heroCvButtons === 'export' || settings.heroCvButtons === 'both';

  const exportPreset = pickExportPreset(exportPresets, locale);

  const socialEntries = profile.socials;

  const statItems = [
    {
      icon: Activity,
      value: stats.yearsExperience,
      suffix: '+',
      label: t('yearsExp'),
      tone: 'primary',
    },
    {
      icon: Layers,
      value: stats.projectCount,
      suffix: '',
      label: t('projects'),
      tone: 'primary',
    },
    {
      icon: ShieldCheck,
      value: stats.certificationCount,
      suffix: '',
      label: t('certifications'),
      tone: 'success',
    },
  ] as const;

  return (
    <AuroraBackground className="border-b border-border/80">
      <section
        id="hero"
        className="relative flex items-center py-8 md:py-12 lg:min-h-[calc(100vh-4.5rem)] lg:py-16"
      >
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
            {/* Left: identity, stats and calls to action */}
            <AnimatedReveal
              direction="up"
              className="space-y-7 sm:space-y-8 lg:col-span-6 xl:col-span-6"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-foreground shadow-2xs backdrop-blur-sm">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      profile.availability.code !== 'not_available'
                        ? 'animate-pulse bg-success shadow-[0_0_8px_currentColor]'
                        : 'bg-muted-foreground',
                    )}
                  />
                  <span>
                    {availabilityLabel} · {workPrefLabel} · {profile.timezone}
                  </span>
                </div>
                {profile.location ? (
                  <Badge
                    variant="outline"
                    className="gap-1.5 bg-background/70 px-3.5 py-1.5 font-mono text-xs shadow-2xs backdrop-blur-sm"
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{profile.location}</span>
                  </Badge>
                ) : null}
              </div>

              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span>{t('eyebrow')}</span>
                </p>
                <h1 className="text-gradient-hero font-heading text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[84px]">
                  {profile.name}
                </h1>
                <p className="max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl">
                  {profile.headline}
                </p>
              </div>

              {profile.interests && profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
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

              <div className="grid max-w-xl grid-cols-3 gap-2.5 sm:gap-4">
                {statItems.map(({ icon: Icon, value, suffix, label, tone }) => (
                  <SpotlightCard
                    key={label}
                    interactiveTilt
                    className="bg-background/70 p-3 sm:p-5"
                  >
                    <span
                      className={cn(
                        'inline-flex h-8 w-8 items-center justify-center rounded-xl border shadow-2xs sm:h-9 sm:w-9',
                        tone === 'success'
                          ? 'border-success/30 bg-success/10 text-success'
                          : 'border-primary/30 bg-primary/10 text-primary',
                      )}
                    >
                      <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    </span>
                    <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                      <CountUp value={value} suffix={suffix} />
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase leading-tight text-muted-foreground sm:text-xs sm:tracking-wider">
                      {label}
                    </p>
                  </SpotlightCard>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {showUploadedCv ? (
                  <Link
                    href="/cv"
                    onClick={() => track('cv_download', { target: `cv-${locale}` })}
                    className={cn(
                      buttonVariants({ variant: 'default', size: 'lg' }),
                      'h-12 w-full px-6 font-semibold shadow-lg shadow-primary/25 transition-transform active:scale-[0.97] sm:w-auto',
                    )}
                  >
                    <Download className="h-4 w-4" />
                    <span>{t('downloadCv')}</span>
                  </Link>
                ) : null}

                {showExportPdf && exportPreset ? (
                  <a
                    href={`/api/pdf/${exportPreset.slug}?locale=${locale}`}
                    onClick={() => track('export_download', { target: exportPreset.slug })}
                    className={cn(
                      buttonVariants({
                        variant: showUploadedCv ? 'outline' : 'default',
                        size: 'lg',
                      }),
                      'h-12 w-full bg-background/70 px-6 font-semibold backdrop-blur-sm transition-transform active:scale-[0.97] sm:w-auto',
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
                    'group h-12 w-full px-6 font-semibold transition-transform active:scale-[0.97] sm:w-auto',
                  )}
                >
                  <span>{t('contactMe')}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {socialEntries.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {socialEntries.slice(0, 4).map(({ platform, url }) => (
                    <a
                      key={platform.code}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-background/70 px-3.5 text-xs font-semibold capitalize text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span>{platform.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              ) : null}
            </AnimatedReveal>

            {/* Right: interactive 3D laptop */}
            <AnimatedReveal
              direction="scale"
              delay={0.1}
              className="lg:col-span-6 xl:col-span-6"
            >
              <LaptopStage
                code={laptopCode}
                images={laptopImages}
                label={t('laptopLabel', { name: profile.name })}
                screenLabel={(n) => t('laptopScreen', { n })}
              />
            </AnimatedReveal>
          </div>
        </Container>
      </section>
    </AuroraBackground>
  );
}
