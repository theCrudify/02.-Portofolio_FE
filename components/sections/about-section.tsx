import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Compass,
  Globe2,
  MapPin,
  Radio,
  Share2,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { SocialIcon } from '@/components/ui/social-icon';
import type { PublicProfile } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface AboutSectionProps {
  profile: PublicProfile | null;
  muted?: boolean;
}

export function AboutSection({ profile, muted }: AboutSectionProps) {
  const t = useTranslations('sections.about');
  if (!profile || !profile.bio) return null;

  // Split bio into distinct paragraphs for readable editorial pacing
  const bioParagraphs = profile.bio
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const availabilityLabel = profile.availability.label;
  const workPrefLabel = profile.workPreference.label;

  return (
    <Section id="about" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
        {/* Left Column: Editorial Bio Presentation */}
        <SpotlightCard className="relative flex flex-col justify-between overflow-hidden p-6 sm:p-8 lg:col-span-7 xl:col-span-8 lg:p-10">
          <div
            aria-hidden="true"
            className="bg-architectural-grid pointer-events-none absolute inset-x-0 top-0 h-36 opacity-30"
          />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-2xs">
                  <UserCheck className="h-4.5 w-4.5" />
                </span>
                <span className="font-heading text-base font-bold text-foreground sm:text-lg">
                  {profile.name}
                </span>
              </div>

              {profile.location ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3.5 py-1 text-xs font-semibold text-foreground shadow-2xs backdrop-blur-xs">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {profile.location} ({profile.timezone})
                  </span>
                </span>
              ) : null}
            </div>

            {/* Structured Paragraphs with Visual Rhythm */}
            <div className="space-y-4">
              {bioParagraphs.map((paragraph, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'text-base leading-[1.85] text-foreground sm:text-lg lg:text-xl',
                    idx === 0 && 'font-medium',
                    idx > 0 && 'border-t border-border/60 pt-4 text-muted-foreground',
                  )}
                >
                  <p>{paragraph}</p>
                </div>
              ))}
            </div>
          </div>

          {profile.referencesNote ? (
            <div className="relative z-10 mt-6 rounded-2xl border border-border/80 bg-background/80 p-4 text-xs leading-relaxed text-muted-foreground shadow-2xs">
              <div className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span>{t('verified')}</span>
              </div>
              <p>{profile.referencesNote}</p>
            </div>
          ) : null}
        </SpotlightCard>

        {/* Right Column: High-Density Operational & Skill Telemetry (Zero Void!) */}
        <div className="flex flex-col gap-5 lg:col-span-5 xl:col-span-4">
          {/* Avatar (if uploaded) */}
          {profile.avatar ? (
            <SpotlightCard className="overflow-hidden p-2.5">
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border/60 bg-muted">
                <Image
                  src={profile.avatar.url}
                  alt={profile.avatar.alt || profile.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </SpotlightCard>
          ) : null}

          {/* Languages Card with Visual Progress Gauges */}
          {profile.languages && profile.languages.length > 0 ? (
            <SpotlightCard className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3">
                <h3 className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  <Globe2 className="h-4 w-4" />
                  <span>{t('languages')}</span>
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {profile.languages.length}
                </span>
              </div>

              <div className="space-y-3.5">
                {profile.languages.map((lang) => {
                  const isNative = lang.level.code === 'native';
                  return (
                    <div
                      key={lang.name}
                      className="rounded-xl border border-border/80 bg-background/85 p-3.5 shadow-2xs transition-colors hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {lang.name}
                        </span>
                        <Badge
                          variant={isNative ? 'default' : 'secondary'}
                          className="capitalize text-xs font-semibold"
                        >
                          {lang.level.label}
                        </Badge>
                      </div>

                      {/* Visual Proficiency Meter */}
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            isNative ? 'w-full bg-primary' : 'w-4/5 bg-primary/75',
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>
          ) : null}

          {/* Operational Status & Readiness Telemetry */}
          <SpotlightCard className="bg-dot-matrix p-5 sm:p-6">
            <h3 className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Radio className="h-4 w-4 animate-pulse" />
              <span>{t('operationalStatus')}</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/90 p-3 shadow-2xs">
                <span className="font-medium text-muted-foreground">{t('availability')}</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      profile.availability.code !== 'not_available'
                        ? 'animate-pulse bg-success shadow-[0_0_6px_currentColor]'
                        : 'bg-muted-foreground',
                    )}
                  />
                  <span>{availabilityLabel}</span>
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/90 p-3 shadow-2xs">
                <span className="font-medium text-muted-foreground">{t('workPreference')}</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                  <Compass className="h-3.5 w-3.5 text-primary" />
                  <span>{workPrefLabel}</span>
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/90 p-3 shadow-2xs">
                <span className="font-medium text-muted-foreground">{t('timezone')}</span>
                <span className="inline-flex items-center gap-1.5 font-mono font-bold text-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{profile.timezone}</span>
                </span>
              </div>
            </div>
          </SpotlightCard>

          {/* Interests & Specializations (if available) */}
          {profile.interests && profile.interests.length > 0 ? (
            <SpotlightCard className="p-5 sm:p-6">
              <h3 className="mb-3.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-4 w-4" />
                <span>{t('interests')}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <Badge
                    key={`${interest.label}-${idx}`}
                    variant="outline"
                    className="border-primary/25 bg-background/95 px-3 py-1.5 text-xs font-medium shadow-2xs"
                  >
                    {interest.label}
                  </Badge>
                ))}
              </div>
            </SpotlightCard>
          ) : null}
          {/* Social Profiles & Presence */}
          {profile.socials && profile.socials.length > 0 ? (
            <SpotlightCard className="p-5 sm:p-6">
              <h3 className="mb-3.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <Share2 className="h-4 w-4" />
                <span>{t('socials')}</span>
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {profile.socials.map(({ platform, url }) =>
                  url ? (
                    <a
                      key={platform.code}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/90 px-3.5 py-2 text-xs font-semibold capitalize text-foreground shadow-2xs transition-all hover:border-primary hover:text-primary hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <SocialIcon
                        platform={platform}
                        className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110"
                      />
                      <span>{platform.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </a>
                  ) : null,
                )}
              </div>
            </SpotlightCard>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
