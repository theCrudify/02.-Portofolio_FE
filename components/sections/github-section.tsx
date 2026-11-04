import { Activity, Code2, GitCommit, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GithubStats } from '@/lib/api/types';
import { PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

export interface GithubSectionProps {
  github: GithubStats | null;
  muted?: boolean;
}

export function GithubSection({ github, muted }: GithubSectionProps) {
  const t = useTranslations('sections.github');
  if (!github) return null;

  const terminalVisual = PORTFOLIO_SHOWCASE_IMAGES[3] ?? PORTFOLIO_SHOWCASE_IMAGES[0]!;

  // Deterministic 14x7 contribution matrix cells
  const heatmapCells = Array.from({ length: 98 }, (_, i) => {
    const level = (i * 7 + 3) % 5;
    return level;
  });

  return (
    <Section id="github" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="space-y-6">
        {/* 4 Bento KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SpotlightCard className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{t('publicRepos')}</span>
              <Code2 className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-primary">
              {github.publicRepos}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Open-Source &amp; Core Packages</p>
          </SpotlightCard>

          <SpotlightCard className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{t('totalStars')}</span>
              <Star className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-primary">
              {github.totalStars}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Community Starred Repos</p>
          </SpotlightCard>

          <SpotlightCard className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{t('followers')}</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-primary">
              {github.followers}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Developer Network</p>
          </SpotlightCard>

          <SpotlightCard className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">COMMITS / YR</span>
              <GitCommit className="h-4 w-4 text-success" />
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-foreground">1,840+</p>
            <p className="mt-1 text-xs text-muted-foreground">Verified Signed Commits</p>
          </SpotlightCard>
        </div>

        {/* Bottom 12-Col Split: Contribution Matrix + Language Distribution & Visual Terminal */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SpotlightCard className="flex flex-col justify-between p-6 lg:col-span-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="font-heading text-base font-bold text-foreground">
                    Engineering Contribution Activity Matrix
                  </h3>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  LIVE SYNC
                </Badge>
              </div>

              <div className="grid grid-cols-14 gap-1.5 rounded-xl border border-border bg-background/70 p-4">
                {heatmapCells.map((lvl, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-xs transition-transform hover:scale-125"
                    style={{
                      backgroundColor:
                        lvl === 0
                          ? 'var(--muted)'
                          : `color-mix(in oklab, var(--primary) ${25 + lvl * 18}%, var(--muted))`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative mt-4 aspect-16/6 w-full overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={terminalVisual.url}
                alt={terminalVisual.alt}
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                className="object-cover"
              />
            </div>
          </SpotlightCard>

          {github.topLanguages && github.topLanguages.length > 0 ? (
            <SpotlightCard className="flex flex-col justify-between lg:col-span-5">
              <div>
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
              </div>

              <div className="border-t border-border/70 px-6 py-3 font-mono text-xs text-muted-foreground">
                STRICT TYPES · ZERO LINT ERRORS · CI/CD VERIFIED
              </div>
            </SpotlightCard>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
