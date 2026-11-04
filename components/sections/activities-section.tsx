'use client';

import { CheckCircle2, Users } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { DetailLink } from '@/components/sections/portfolio-detail';
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
  // Activity type code, or 'all'. Types and labels come from master data.
  const [filter, setFilter] = useState<string>('all');

  if (!activities || activities.length === 0) return null;

  // Only offer filters that actually have entries.
  const types = [...new Map(activities.map((a) => [a.type.code, a.type])).values()];

  const filtered =
    filter === 'all' ? activities : activities.filter((a) => a.type.code === filter);

  return (
    <Section id="activities" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      {activities.length > 3 && types.length > 1 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {[{ code: 'all', label: t('all') }, ...types].map((tab) => (
            <Button
              key={tab.code}
              type="button"
              size="sm"
              variant={filter === tab.code ? 'default' : 'outline'}
              onClick={() => setFilter(tab.code)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          'grid grid-cols-1 gap-4',
          filtered.length === 1
            ? 'lg:grid-cols-1'
            : filtered.length === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 xl:grid-cols-3',
        )}
      >
        {filtered.map((act) => (
          <SpotlightCard
            key={act.id}
            className="group overflow-hidden transition-transform duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
          >
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
            <CardHeader className="space-y-1.5 p-5 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                    <Users className="h-3.5 w-3.5" />
                  </span>
                  <Badge variant="secondary">{act.type.label}</Badge>
                </div>
                {act.startDate ? (
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {formatPeriod(act.startDate, act.endDate, locale)}
                  </span>
                ) : null}
              </div>
              <CardTitle className="pt-1 text-base leading-snug sm:text-lg">
                {act.role}
              </CardTitle>
              <p className="line-clamp-2 text-xs font-semibold text-primary">
                {act.organization?.name}
                {act.eventName ? ` · ${act.eventName}` : ''}
              </p>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0">
              {act.description ? (
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
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
            <DetailLink href={`/activities/${act.id}`} />
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
