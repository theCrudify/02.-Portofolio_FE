import { CheckCircle2, Globe2, MapPin, Sparkles, UserCheck } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import type { PublicProfile } from '@/lib/api/types';

export interface AboutSectionProps {
  profile: PublicProfile | null;
  muted?: boolean;
}

export function AboutSection({ profile, muted }: AboutSectionProps) {
  const t = useTranslations('sections.about');
  if (!profile || !profile.bio) return null;

  return (
    <Section id="about" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
        {/* Left Column: Deep Bio & Philosophy */}
        <SpotlightCard className="relative flex flex-col justify-between overflow-hidden p-7 sm:p-10 lg:col-span-7 xl:col-span-8 lg:p-12">
          <div
            aria-hidden="true"
            className="bg-architectural-grid pointer-events-none absolute inset-x-0 top-0 h-36 opacity-35"
          />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-2xs">
                  <UserCheck className="h-4.5 w-4.5" />
                </span>
                <span className="font-heading text-base font-bold text-foreground">
                  {profile.name}
                </span>
              </div>

              {profile.location ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/70 px-4 py-1.5 text-xs font-semibold text-foreground shadow-2xs">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {t('location')}: {profile.location} ({profile.timezone})
                  </span>
                </span>
              ) : null}
            </div>

            <p className="whitespace-pre-line text-lg leading-[1.85] text-foreground sm:text-xl lg:text-2xl">
              {profile.bio}
            </p>
          </div>

          {profile.referencesNote ? (
            <div className="relative z-10 mt-8 rounded-2xl border border-border/70 bg-background/70 p-4 text-xs leading-relaxed text-muted-foreground shadow-2xs">
              <div className="flex items-center gap-2 text-foreground font-semibold mb-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span>Verification & References</span>
              </div>
              <span>{profile.referencesNote}</span>
            </div>
          ) : null}
        </SpotlightCard>

        {/* Right Column: Visual Deck, Languages, Interests */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-5 xl:col-span-4">
          {profile.avatar ? (
            <SpotlightCard className="overflow-hidden p-3">
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted">
                <Image
                  src={profile.avatar.url}
                  alt={profile.avatar.alt || profile.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 520px"
                  className="object-cover"
                />
              </div>
            </SpotlightCard>
          ) : null}

          {profile.languages && profile.languages.length > 0 ? (
            <SpotlightCard className="flex-1 p-6 sm:p-8">
              <h3 className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                <Globe2 className="h-4.5 w-4.5" />
                <span>{t('languages')}</span>
              </h3>
              <div className="space-y-3">
                {profile.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center justify-between rounded-2xl border border-border/80 bg-background/85 px-4.5 py-3.5 shadow-2xs transition-colors hover:border-primary/40"
                  >
                    <span className="text-sm font-bold text-foreground sm:text-base">
                      {lang.name}
                    </span>
                    <Badge variant="secondary" className="capitalize px-3 py-1 text-xs">
                      {lang.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          ) : null}

          {profile.interests && profile.interests.length > 0 ? (
            <SpotlightCard className="bg-dot-matrix p-6 sm:p-8">
              <h3 className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                <Sparkles className="h-4.5 w-4.5" />
                <span>{t('interests')}</span>
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {profile.interests.map((interest, idx) => (
                  <Badge
                    key={`${interest.label}-${idx}`}
                    variant="outline"
                    className="border-primary/25 bg-background/95 px-4 py-2 text-xs font-medium shadow-2xs"
                  >
                    {interest.label}
                  </Badge>
                ))}
              </div>
            </SpotlightCard>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
