import {
  CheckCircle2,
  Cpu,
  Globe2,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import type { PublicProfile } from '@/lib/api/types';
import { DEFAULT_AVATAR_URI, PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

export interface AboutSectionProps {
  profile: PublicProfile | null;
  muted?: boolean;
}

export function AboutSection({ profile, muted }: AboutSectionProps) {
  const t = useTranslations('sections.about');
  if (!profile || !profile.bio) return null;

  const mosaicPrimary = PORTFOLIO_SHOWCASE_IMAGES[1] ?? PORTFOLIO_SHOWCASE_IMAGES[0]!;
  const mosaicSecondary = PORTFOLIO_SHOWCASE_IMAGES[5] ?? PORTFOLIO_SHOWCASE_IMAGES[0]!;
  const mosaicTertiary = PORTFOLIO_SHOWCASE_IMAGES[7] ?? PORTFOLIO_SHOWCASE_IMAGES[0]!;

  const engineeringPillars = [
    {
      label: 'Distributed Edge & API Architecture',
      metric: '98%',
      detail: 'Hono · Cloudflare Workers · Zero-JSON Query Engine',
    },
    {
      label: 'Modern Frontend & Design Systems',
      metric: '96%',
      detail: 'Next.js 15 · React 19 · WCAG AA Adaptive Themes',
    },
    {
      label: 'Relational Data & Cloud Reliability',
      metric: '95%',
      detail: 'PostgreSQL · Drizzle ORM · Automated ETag Caching',
    },
  ];

  return (
    <Section id="about" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="space-y-6">
        {/* Top Row: 7-Col Editorial Manifesto + 5-Col Multi-Image Mosaic Collage */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SpotlightCard className="flex flex-col justify-between p-6 md:p-8 lg:col-span-7">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Cpu className="h-4 w-4" />
                  <span>Engineering Philosophy &amp; System Craft</span>
                </div>
                {profile.location ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>
                      {profile.location} ({profile.timezone})
                    </span>
                  </span>
                ) : null}
              </div>

              <p className="whitespace-pre-line text-base leading-[1.8] text-foreground md:text-lg">
                {profile.bio}
              </p>

              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                {[
                  'Action-Sliced Modular OOP Architecture',
                  'Zero-JSON Deterministic Flat Query Engine',
                  'Sub-15ms Edge Caching with ETag 304',
                  'End-to-End Type Safety & Automated Tests',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 rounded-lg border border-border/80 bg-background/70 px-3.5 py-2.5 text-xs font-medium text-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-mono">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>PRODUCTION-GRADE STANDARDS</span>
              </span>
              {profile.referencesNote ? (
                <span className="font-medium text-foreground">{profile.referencesNote}</span>
              ) : null}
            </div>
          </SpotlightCard>

          {/* 5-Col Multi-Image Visual Collage */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-5">
            <SpotlightCard className="group col-span-2 overflow-hidden p-2">
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={mosaicPrimary.url}
                  alt={mosaicPrimary.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-1 text-xs uppercase">
                      {mosaicPrimary.category}
                    </Badge>
                    <p className="font-heading text-sm font-bold text-foreground">
                      {mosaicPrimary.title}
                    </p>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="group overflow-hidden p-2">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={profile.avatar?.url ?? DEFAULT_AVATAR_URI}
                  alt={profile.name}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-background/85 px-2.5 py-1.5 backdrop-blur-xs">
                  <p className="truncate font-mono text-xs font-semibold text-foreground">
                    {profile.name}
                  </p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="group overflow-hidden p-2">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={mosaicTertiary.url || mosaicSecondary.url}
                  alt={mosaicTertiary.alt}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-background/85 px-2.5 py-1.5 backdrop-blur-xs">
                  <p className="truncate font-mono text-xs font-semibold text-foreground">
                    {mosaicTertiary.title}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Bottom Row: 3 Architectural Bento Cards (Core Pillars, Languages, Focus Areas) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SpotlightCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                <span>Core Architecture Pillars</span>
              </h3>
              <span className="font-mono text-xs text-muted-foreground">01</span>
            </div>
            <div className="space-y-4">
              {engineeringPillars.map((pillar) => (
                <div key={pillar.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">{pillar.label}</span>
                    <span className="font-mono text-primary">{pillar.metric}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: pillar.metric }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="flex flex-col justify-between p-6">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                  <Globe2 className="h-4 w-4 text-primary" />
                  <span>{t('languages')}</span>
                </h3>
                <span className="font-mono text-xs text-muted-foreground">02</span>
              </div>

              {profile.languages && profile.languages.length > 0 ? (
                <div className="space-y-3">
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
              ) : null}
            </div>

            <div className="mt-4 rounded-lg border border-border/80 bg-muted/40 p-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Async &amp; Global Ready:</span>{' '}
              Experienced in distributed cross-timezone engineering sprints &amp; RFC documentation.
            </div>
          </SpotlightCard>

          <SpotlightCard className="flex flex-col justify-between p-6">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>{t('interests')}</span>
                </h3>
                <span className="font-mono text-xs text-muted-foreground">03</span>
              </div>

              {profile.interests && profile.interests.length > 0 ? (
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
              ) : null}
            </div>

            <div className="relative mt-4 aspect-16/6 w-full overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={mosaicSecondary.url}
                alt={mosaicSecondary.alt}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
          </SpotlightCard>
        </div>
      </div>
    </Section>
  );
}
