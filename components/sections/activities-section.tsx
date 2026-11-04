'use client';

import { CheckCircle2, Users } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PublicActivity, SupportedLocale } from '@/lib/api/types';
import { formatPeriod } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface ActivitiesSectionProps {
  activities: PublicActivity[];
  locale: SupportedLocale;
  muted?: boolean;
}

export function ActivitiesSection({ activities, locale, muted }: ActivitiesSectionProps) {
  const t = useTranslations('sections.activities');
  const [filter, setFilter] = useState<'all' | 'volunteer' | 'committee' | 'organization'>('all');

  if (!activities || activities.length === 0) return null;

  const filtered =
    filter === 'all' ? activities : activities.filter((a) => a.type === filter);

  return (
    <Section id="activities" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      {activities.length > 3 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {(['all', 'volunteer', 'committee', 'organization'] as const).map((tab) => (
            <Button
              key={tab}
              type="button"
              size="sm"
              variant={filter === tab ? 'default' : 'outline'}
              onClick={() => setFilter(tab)}
            >
              {t(tab)}
            </Button>
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          filtered.length === 1 ? 'lg:grid-cols-1' : 'md:grid-cols-2',
        )}
      >
        {filtered.map((act) => (
          <SpotlightCard key={act.id} className="group overflow-hidden">
            {act.media ? (
              <div className="relative aspect-16/7 w-full overflow-hidden border-b border-border/60 bg-muted">
                <Image
                  src={act.media.url}
                  alt={act.media.alt || `${act.role} · ${act.organization}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : null}
            <CardHeader className="bg-dot-matrix space-y-2 border-b border-border/60 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </span>
                  <Badge variant="secondary">{t(act.type)}</Badge>
                </div>
                {act.startDate ? (
                  <span className="rounded-full border border-border bg-background/85 px-3 py-1 font-mono text-xs text-muted-foreground">
                    {formatPeriod(act.startDate, act.endDate, locale)}
                  </span>
                ) : null}
              </div>
              <CardTitle className="pt-1 text-xl">{act.role}</CardTitle>
              <p className="text-sm font-semibold text-primary">
                {act.organization}
                {act.eventName ? ` · ${act.eventName}` : ''}
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {act.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {act.description}
                </p>
              ) : null}
              {act.achievements.length > 0 ? (
                <ul
                  className={cn(
                    'grid grid-cols-1 gap-2.5',
                    filtered.length === 1 ? 'sm:grid-cols-2' : 'grid-cols-1',
                  )}
                >
                  {act.achievements.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-background/80 p-3 text-sm text-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
