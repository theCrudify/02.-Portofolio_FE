import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GithubStats } from '@/lib/api/types';

export interface GithubSectionProps {
  github: GithubStats | null;
  muted?: boolean;
}

export function GithubSection({ github, muted }: GithubSectionProps) {
  const t = useTranslations('sections.github');
  if (!github) return null;

  return (
    <Section id="github" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="grid grid-cols-3 gap-4 lg:col-span-5">
          <Card className="p-5">
            <p className="font-heading text-2xl font-bold text-primary md:text-3xl">
              {github.publicRepos}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t('publicRepos')}</p>
          </Card>
          <Card className="p-5">
            <p className="font-heading text-2xl font-bold text-primary md:text-3xl">
              {github.totalStars}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t('totalStars')}</p>
          </Card>
          <Card className="p-5">
            <p className="font-heading text-2xl font-bold text-primary md:text-3xl">
              {github.followers}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t('followers')}</p>
          </Card>
        </div>

        {github.topLanguages && github.topLanguages.length > 0 ? (
          <Card className="lg:col-span-7">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('topLanguages')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {github.topLanguages.map((lang) => (
                <div key={lang.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{lang.name}</span>
                    <span className="font-mono text-muted-foreground">{lang.percent}%</span>
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
          </Card>
        ) : null}
      </div>
    </Section>
  );
}

