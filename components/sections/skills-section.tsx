'use client';

import { Cpu, Database, Globe, Layers, Sparkles, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SiteData } from '@/lib/api/types';

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
  const [selectedCat, setSelectedCat] = useState<'all' | keyof SiteData['technologies']>('all');

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

  return (
    <Section id="skills" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="space-y-6">
        {nonEmpty.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-card/80 p-3 backdrop-blur-md">
            {nonEmpty.map((cat) => (
              <Button
                key={cat}
                type="button"
                size="sm"
                variant={selectedCat === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCat((prev) => (prev === cat ? 'all' : cat))}
              >
                {t(cat)} ({technologies[cat].length})
              </Button>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            return (
              <SpotlightCard key={cat} className="p-6">
                <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-heading text-base font-bold text-foreground">{t(cat)}</h3>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {technologies[cat].length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies[cat].map((tech) => (
                    <Badge key={tech.slug} variant="secondary" className="px-3 py-1 text-xs">
                      {tech.name}
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
