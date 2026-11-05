import { Code2, ExternalLink, GitCommit, Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { SocialIcon } from '@/components/ui/social-icon';
import type { GithubStats, PublicProfile } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface GithubSectionProps {
  github: GithubStats | null;
  profile?: PublicProfile | null;
  muted?: boolean;
}

function getLangColor(name: string): { bg: string; text: string } {
  const norm = name.toLowerCase().trim();
  switch (norm) {
    case 'typescript':
    case 'ts':
      return { bg: 'bg-blue-500', text: 'text-blue-500' };
    case 'javascript':
    case 'js':
      return { bg: 'bg-amber-400', text: 'text-amber-500' };
    case 'python':
    case 'py':
      return { bg: 'bg-emerald-500', text: 'text-emerald-500' };
    case 'html':
      return { bg: 'bg-orange-500', text: 'text-orange-500' };
    case 'css':
    case 'scss':
      return { bg: 'bg-sky-400', text: 'text-sky-500' };
    case 'c#':
    case 'csharp':
      return { bg: 'bg-purple-500', text: 'text-purple-500' };
    case 'c':
      return { bg: 'bg-slate-500', text: 'text-slate-500' };
    case 'c++':
    case 'cpp':
      return { bg: 'bg-pink-500', text: 'text-pink-500' };
    case 'go':
    case 'golang':
      return { bg: 'bg-cyan-500', text: 'text-cyan-500' };
    case 'rust':
      return { bg: 'bg-amber-700', text: 'text-amber-700' };
    case 'php':
      return { bg: 'bg-indigo-500', text: 'text-indigo-500' };
    case 'java':
      return { bg: 'bg-red-500', text: 'text-red-500' };
    case 'shell':
    case 'bash':
      return { bg: 'bg-lime-500', text: 'text-lime-500' };
    default:
      return { bg: 'bg-primary', text: 'text-primary' };
  }
}

export function GithubSection({ github, profile, muted }: GithubSectionProps) {
  const t = useTranslations('sections.github');
  if (!github) return null;

  const githubSocial = profile?.socials?.find(
    (s) => s.platform.code.toLowerCase() === 'github' || s.platform.label.toLowerCase().includes('github'),
  );
  const githubUrl = githubSocial?.url || 'https://github.com';
  const handle = githubSocial?.handle || (githubSocial?.url ? githubSocial.url.split('/').filter(Boolean).pop() : null);

  return (
    <Section
      id="github"
      eyebrow={t('eyebrow')}
      title={t('title')}
      muted={muted}
      actions={
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-4 py-1.5 text-xs font-semibold text-foreground shadow-2xs backdrop-blur-xs transition-all hover:border-primary hover:text-primary hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SocialIcon platform="github" className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
          <span>{handle ? `@${handle}` : 'GitHub'}</span>
          <ExternalLink className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </a>
      }
    >
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Left: GitHub Profile & Telemetry Card */}
        <SpotlightCard className="relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 lg:col-span-5">
          <div
            aria-hidden="true"
            className="bg-dot-matrix pointer-events-none absolute inset-0 opacity-40"
          />

          <div className="relative z-10 space-y-6">
            {/* Identity row */}
            <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-2xs">
                  <SocialIcon platform="github" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {handle ? `@${handle}` : 'GitHub'}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">Open Source Activity</p>
                </div>
              </div>

              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs transition-all hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>Profil</span>
                  <ExternalLink className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </a>
              ) : null}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/80 bg-background/85 p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[11px] font-semibold">{t('publicRepos')}</span>
                  <Code2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="mt-1.5 font-heading text-2xl font-bold text-primary">
                  {github.publicRepos}
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-background/85 p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[11px] font-semibold">{t('totalStars')}</span>
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <p className="mt-1.5 font-heading text-2xl font-bold text-foreground">
                  {github.totalStars}
                </p>
              </div>

              <div className="rounded-xl border border-border/80 bg-background/85 p-3.5 shadow-2xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[11px] font-semibold">{t('followers')}</span>
                  <Users className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="mt-1.5 font-heading text-2xl font-bold text-foreground">
                  {github.followers}
                </p>
              </div>
            </div>

            {/* Activity highlight pill */}
            {github.contributionsLastYear ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
                <GitCommit className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="font-semibold text-primary">{github.contributionsLastYear}</strong>{' '}
                  kontribusi dalam 1 tahun terakhir
                </span>
              </div>
            ) : null}
          </div>

          {/* Bottom live indicator */}
          <div className="relative z-10 mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_6px_currentColor]" />
              <span>Sinkronisasi otomatis GitHub</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Public Repos
            </span>
          </div>
        </SpotlightCard>

        {/* Right: GitHub Top Languages Breakdown */}
        {github.topLanguages && github.topLanguages.length > 0 ? (
          <SpotlightCard className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-7">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-2xs">
                    <Code2 className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">{t('topLanguages')}</h3>
                    <p className="text-xs text-muted-foreground">Proporsi kode di repositori publik</p>
                  </div>
                </div>
                <span className="rounded-full border border-border/80 bg-background/85 px-3 py-1 font-mono text-xs font-semibold text-primary shadow-2xs">
                  {github.topLanguages[0]?.name} {github.topLanguages[0]?.percent}%
                </span>
              </div>

              {/* GitHub Signature Multi-Segmented Progress Bar */}
              <div className="space-y-2">
                <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted/80 p-0.5 ring-1 ring-border/80">
                  {github.topLanguages.map((lang, idx) => (
                    <div
                      key={lang.name}
                      className={cn(
                        'h-full transition-all duration-500',
                        idx === 0 && 'rounded-l-full',
                        idx === (github.topLanguages?.length ?? 1) - 1 && 'rounded-r-full',
                        getLangColor(lang.name).bg,
                      )}
                      style={{ width: `${Math.max(2, lang.percent)}%` }}
                      title={`${lang.name}: ${lang.percent}%`}
                    />
                  ))}
                </div>
              </div>

              {/* Language Grid Cards */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {github.topLanguages.map((lang) => {
                  const color = getLangColor(lang.name);
                  return (
                    <div
                      key={lang.name}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/85 p-3.5 shadow-2xs transition-all hover:border-primary/40 hover:bg-background"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={cn('h-3 w-3 shrink-0 rounded-full shadow-2xs', color.bg)} />
                        <span className="truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {lang.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn('h-full rounded-full', color.bg)}
                            style={{ width: `${Math.min(100, Math.max(4, lang.percent))}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-muted-foreground w-10 text-right">
                          {lang.percent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SpotlightCard>
        ) : null}
      </div>
    </Section>
  );
}
