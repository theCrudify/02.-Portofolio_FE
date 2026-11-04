import { Code2, Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialIcon } from '@/components/ui/social-icon';
import type { GithubStats } from '@/lib/api/types';

export interface GithubSectionProps {
  github: GithubStats | null;
  muted?: boolean;
}

export function GithubSection({ github, muted }: GithubSectionProps) {
  const t = useTranslations('sections.github');
  if (!github) return null;

  return (
    <Section
      id="github"
      eyebrow={t('eyebrow')}
      title={t('title')}
      muted={muted}
      actions={
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-4 py-1.5 text-xs font-semibold text-foreground shadow-2xs backdrop-blur-xs">
          <SocialIcon platform="github" className="h-4 w-4 text-primary" />
          <span>GitHub</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-5">
          <SpotlightCard className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{t('publicRepos')}</span>
              <Code2 className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-primary">
              {github.publicRepos}
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{t('totalStars')}</span>
              <Star className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-primary">
              {github.totalStars}
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{t('followers')}</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-primary">
              {github.followers}
            </p>
          </SpotlightCard>
        </div>

        {github.topLanguages && github.topLanguages.length > 0 ? (
          <SpotlightCard className="lg:col-span-7">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('topLanguages')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {github.topLanguages.map((lang) => (
                <div
                  key={lang.name}
                  className="space-y-1.5 rounded-lg border border-border/70 bg-background/70 p-3"
                >
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{lang.name}</span>
                    <span className="font-mono text-primary">{lang.percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, Math.max(2, lang.percent))}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </SpotlightCard>
        ) : null}
      </div>
    </Section>
  );
}
