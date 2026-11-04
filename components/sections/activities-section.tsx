'use client';

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
import { PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map((act, idx) => {
          const mediaUrl =
            act.media?.url ??
            PORTFOLIO_SHOWCASE_IMAGES[(idx + 7) % PORTFOLIO_SHOWCASE_IMAGES.length].url;
          const mediaAlt = act.media?.alt || `${act.role} · ${act.organization}`;

          return (
            <SpotlightCard key={act.id} className="group overflow-hidden">
              <div className="relative aspect-16/7 w-full overflow-hidden border-b border-border/60 bg-muted">
                <Image
                  src={mediaUrl}
                  alt={mediaAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{t(act.type)}</Badge>
                  {act.startDate ? (
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatPeriod(act.startDate, act.endDate, locale)}
                    </span>
                  ) : null}
                </div>
                <CardTitle>{act.role}</CardTitle>
                <p className="text-sm font-medium text-primary">
                  {act.organization}
                  {act.eventName ? ` · ${act.eventName}` : ''}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {act.description ? (
                  <p className="text-sm text-muted-foreground">{act.description}</p>
                ) : null}
                {act.achievements.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
                    {act.achievements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
