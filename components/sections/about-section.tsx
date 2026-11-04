import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <p className="max-w-[65ch] whitespace-pre-line text-base leading-[1.7] text-foreground md:text-lg">
            {profile.bio}
          </p>
          {profile.location ? (
            <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                {profile.location} ({profile.timezone})
              </span>
            </div>
          ) : null}
        </div>

        <div className="space-y-6 lg:col-span-5">
          {profile.languages && profile.languages.length > 0 ? (
            <div className="rounded-md border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t('languages')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <Badge key={lang.name} variant="secondary" className="px-3 py-1">
                    {lang.name} · <span className="ml-1 capitalize opacity-75">{lang.level}</span>
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {profile.interests && profile.interests.length > 0 ? (
            <div className="rounded-md border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t('interests')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <Badge key={`${interest.label}-${idx}`} variant="outline" className="px-3 py-1">
                    {interest.label}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

