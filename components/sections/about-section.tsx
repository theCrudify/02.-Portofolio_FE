import { Globe2, MapPin, Sparkles, UserCheck } from 'lucide-react';
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
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <SpotlightCard className="relative flex flex-col justify-between overflow-hidden p-6 sm:p-8 lg:col-span-7">
          <div
            aria-hidden="true"
            className="bg-architectural-grid pointer-events-none absolute inset-x-0 top-0 h-28 opacity-40"
          />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <UserCheck className="h-4 w-4" />
                </span>
                <span className="font-heading text-sm font-bold text-foreground">
                  {profile.name}
                </span>
              </div>

              {profile.location ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/70 px-3.5 py-1 text-xs font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {t('location')}: {profile.location} ({profile.timezone})
                  </span>
                </span>
              ) : null}
            </div>

            <p className="whitespace-pre-line text-base leading-[1.85] text-foreground sm:text-lg">
              {profile.bio}
            </p>
          </div>

          {profile.referencesNote ? (
            <div className="relative z-10 mt-6 border-t border-border/80 pt-4 text-xs text-muted-foreground">
              <span>{profile.referencesNote}</span>
            </div>
          ) : null}
        </SpotlightCard>

        <div className="flex flex-col justify-between gap-6 lg:col-span-5">
          {profile.avatar ? (
            <SpotlightCard className="overflow-hidden p-2.5">
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-lg border border-border/60 bg-muted">
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

          {profile.languages && profile.languages.length > 0 ? (
            <SpotlightCard className="flex-1 p-6">
              <h3 className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <Globe2 className="h-4 w-4" />
                <span>{t('languages')}</span>
              </h3>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {profile.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 px-4 py-3 shadow-2xs"
                  >
                    <span className="text-sm font-semibold text-foreground">{lang.name}</span>
                    <Badge variant="secondary" className="capitalize">
                      {lang.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          ) : null}

          {profile.interests && profile.interests.length > 0 ? (
            <SpotlightCard className="bg-dot-matrix p-6">
              <h3 className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-4 w-4" />
                <span>{t('interests')}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <Badge
                    key={`${interest.label}-${idx}`}
                    variant="outline"
                    className="border-primary/25 bg-background/90 px-3.5 py-1.5 text-xs font-medium shadow-2xs"
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
