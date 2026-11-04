'use client';

import { Cpu, Database, Globe, Layers, Sparkles, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { TechLogo } from '@/components/project/tech-logo';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SiteData } from '@/lib/api/types';
import { cn } from '@/lib/utils';

export interface SkillsSectionProps {
  technologies: SiteData['technologies'];
  muted?: boolean;
}

const CATEGORY_ICONS = {
  frontend: Globe,
  backend: Cpu,
  database: Database,
  devops: Layers,
  tools: Wrench,
  soft_skill: Sparkles,
} as const;

export function SkillsSection({ technologies, muted }: SkillsSectionProps) {
  const t = useTranslations('sections.skills');
  const [selectedCat, setSelectedCat] = useState<'all' | keyof SiteData['technologies']>(
    'all',
  );

  const categories = [
    'frontend',
    'backend',
    'database',
    'devops',
    'tools',
    'soft_skill',
  ] as const;

  const nonEmpty = categories.filter((c) => (technologies[c]?.length ?? 0) > 0);
  if (nonEmpty.length === 0) return null;

  const visibleCategories =
    selectedCat === 'all' ? nonEmpty : nonEmpty.filter((c) => c === selectedCat);

  const allTech = nonEmpty.flatMap((c) => technologies[c]);

  return (
    <Section id="skills" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="space-y-6">
        {/* Endless logo strip; the duplicate copy makes the loop seamless and is hidden from AT. */}
        <div className="marquee-mask group/marquee relative overflow-hidden py-2">
          <div className="marquee-track flex w-max gap-3 group-hover/marquee:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0 gap-3"
              >
                {allTech.map((tech) => (
                  <li
                    key={`${copy}-${tech.slug}`}
                    className="inline-flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card/85 px-4 py-2.5 text-sm font-semibold text-foreground shadow-2xs backdrop-blur-md"
                  >
                    <TechLogo name={tech.name} icon={tech.icon} className="h-6 w-6" />
                    <span className="whitespace-nowrap">{tech.name}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {nonEmpty.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-card/85 p-2.5 shadow-2xs backdrop-blur-md">
            {nonEmpty.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const isSelected = selectedCat === cat;
              return (
                <Button
                  key={cat}
                  type="button"
                  size="sm"
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => setSelectedCat((prev) => (prev === cat ? 'all' : cat))}
                  className="gap-1.5"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>
                    {t(cat)} ({technologies[cat].length})
                  </span>
                </Button>
              );
            })}
          </div>
        ) : null}

        <div
          className={cn(
            'grid grid-cols-1 gap-5',
            visibleCategories.length === 1
              ? 'lg:grid-cols-1'
              : visibleCategories.length === 2
                ? 'md:grid-cols-2'
                : 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {visibleCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            return (
              <SpotlightCard key={cat} className="relative overflow-hidden p-6">
                <div
                  aria-hidden="true"
                  className="bg-dot-matrix pointer-events-none absolute top-0 right-0 h-24 w-24 opacity-40"
                />
                <div className="relative z-10 mb-4 flex items-center justify-between border-b border-border/70 pb-3.5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-2xs">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                      {t(cat)}
                    </h3>
                  </div>
                  <Badge variant="outline" className="bg-background/80 font-mono text-xs">
                    {technologies[cat].length}
                  </Badge>
                </div>
                <div className="relative z-10 flex flex-wrap gap-2">
                  {technologies[cat].map((tech) => (
                    <Badge
                      key={tech.slug}
                      variant="secondary"
                      className="inline-flex items-center gap-2 border border-border/60 bg-background/85 py-1.5 pr-3 pl-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 motion-reduce:hover:translate-y-0"
                    >
                      <TechLogo name={tech.name} icon={tech.icon} />
                      <span>{tech.name}</span>
                    </Badge>
                  ))}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
