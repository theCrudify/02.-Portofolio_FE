'use client';

import { ArrowRight, Download, FileText } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/container';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type { PublicProfile, PublicSiteSettings } from '@/lib/api/types';
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
}

export function HeroSection({ profile, settings, stats, locale }: HeroSectionProps) {
  const t = useTranslations('hero');
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

  return (
    <section id="hero" className="py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-medium text-foreground">
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
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                {t('eyebrow')}
              </p>
              <h1 className="font-heading text-[40px] font-bold leading-[1.1] tracking-tight text-foreground md:text-[64px]">
                {profile.name}
              </h1>
              <p className="max-w-[65ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
                {profile.headline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 py-2">
              <div>
                <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                  {stats.yearsExperience}+
                </p>
                <p className="text-xs text-muted-foreground">{t('yearsExp')}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                  {stats.projectCount}
                </p>
                <p className="text-xs text-muted-foreground">{t('projects')}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                  {stats.certificationCount}
                </p>
                <p className="text-xs text-muted-foreground">{t('certifications')}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {showUploadedCv ? (
                <Link
                  href="/cv"
                  onClick={() => track('cv_download', { target: `cv-${locale}` })}
                  className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'w-full sm:w-auto')}
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
                className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'w-full sm:w-auto')}
              >
                <span>{t('contactMe')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {profile.avatar ? (
            <div className="flex justify-center lg:col-span-4 lg:justify-end">
              <div className="relative h-64 w-64 overflow-hidden rounded-lg border border-border bg-muted md:h-80 md:w-80">
                <Image
                  src={profile.avatar.url}
                  alt={profile.avatar.alt || profile.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

