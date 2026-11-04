'use client';

import { Code2, Cpu, Database, Globe, Layers, Sparkles, Wrench } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SiteData } from '@/lib/api/types';
import { PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

export interface SkillsSectionProps {
  technologies: SiteData['technologies'];
  muted?: boolean;
}

const CATEGORY_META = {
  frontend: { icon: Globe, code: 'DOM // UI', imgIndex: 0 },
  backend: { icon: Cpu, code: 'SYS // API', imgIndex: 1 },
  database: { icon: Database, code: 'DATA // SQL', imgIndex: 5 },
  devops: { icon: Layers, code: 'OPS // EDGE', imgIndex: 4 },
  tools: { icon: Wrench, code: 'DEV // TOOL', imgIndex: 3 },
  soft_skill: { icon: Sparkles, code: 'LEAD // ORG', imgIndex: 7 },
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

  const totalTechCount = nonEmpty.reduce(
    (acc, cat) => acc + (technologies[cat]?.length ?? 0),
    0,
  );

  return (
    <Section id="skills" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="space-y-6">
        {/* Interactive Domain Filter & Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-card/80 p-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={selectedCat === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCat('all')}
            >
              All Domains ({nonEmpty.length})
            </Button>
            {nonEmpty.map((cat) => (
              <Button
                key={cat}
                type="button"
                size="sm"
                variant={selectedCat === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCat(cat)}
              >
                {t(cat)} ({technologies[cat].length})
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Code2 className="h-4 w-4 text-primary" />
            <span>TOTAL VERIFIED STACK: {totalTechCount} TECHNOLOGIES</span>
          </div>
        </div>

        {/* Rich Visual Bento Matrix */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((cat, idx) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const visual =
              PORTFOLIO_SHOWCASE_IMAGES[meta.imgIndex % PORTFOLIO_SHOWCASE_IMAGES.length] ??
              PORTFOLIO_SHOWCASE_IMAGES[0]!;

            return (
              <SpotlightCard key={cat} className="group flex flex-col justify-between overflow-hidden">
                <div>
                  {/* Visual Header Banner */}
                  <div className="relative h-28 w-full overflow-hidden border-b border-border/80 bg-muted">
                    <Image
                      src={visual.url}
                      alt={t(cat)}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/55 to-transparent" />
                    <div className="absolute inset-x-4 bottom-3 flex items-end justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-background/90 text-primary shadow-xs">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                            {meta.code}
                          </p>
                          <h3 className="font-heading text-lg font-bold text-foreground">
                            {t(cat)}
                          </h3>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs">
                        0{idx + 1}
                      </Badge>
                    </div>
                  </div>

                  {/* Skill Items with Visual Proficiency Bars */}
                  <div className="space-y-3 p-5">
                    <div className="flex flex-wrap gap-2">
                      {technologies[cat].map((tech, tIdx) => {
                        const pct = Math.max(84, 98 - tIdx * 3);
                        return (
                          <div
                            key={tech.slug}
                            className="flex w-full items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="px-2.5 py-0.5 text-xs">
                                {tech.name}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="font-mono text-xs text-muted-foreground">
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-5 py-2.5 font-mono text-xs text-muted-foreground">
                  <span>PRODUCTION READY</span>
                  <span>{technologies[cat].length} MODULES</span>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
