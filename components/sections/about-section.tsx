import { Globe2, MapPin, Sparkles } from 'lucide-react';
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <SpotlightCard className="flex flex-col justify-between p-6 md:p-8 lg:col-span-7">
          <div className="space-y-5">
            {profile.location ? (
              <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {t('location')}: {profile.location} ({profile.timezone})
                  </span>
                </span>
              </div>
            ) : null}

            <p className="whitespace-pre-line text-base leading-[1.8] text-foreground md:text-lg">
              {profile.bio}
            </p>
          </div>

          {profile.referencesNote ? (
            <div className="mt-6 border-t border-border/80 pt-4 text-xs text-muted-foreground">
              <span>{profile.referencesNote}</span>
            </div>
          ) : null}
        </SpotlightCard>

        <div className="space-y-6 lg:col-span-5">
          {profile.avatar ? (
            <SpotlightCard className="overflow-hidden p-2">
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-lg bg-muted">
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
            <SpotlightCard className="p-6">
              <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                <Globe2 className="h-4 w-4 text-primary" />
                <span>{t('languages')}</span>
              </h3>
              <div className="space-y-2.5">
                {profile.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center justify-between rounded-lg border border-border bg-background/70 px-3.5 py-2.5"
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
            <SpotlightCard className="p-6">
              <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{t('interests')}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <Badge
                    key={`${interest.label}-${idx}`}
                    variant="outline"
                    className="bg-background/80 px-3 py-1.5 text-xs font-medium"
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
