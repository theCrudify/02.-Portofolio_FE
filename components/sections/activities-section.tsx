'use client';

import { ArrowUpRight, CheckCircle2, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { OrgMark } from '@/components/sections/org-mark';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type { PublicActivity, SupportedLocale } from '@/lib/api/types';
import { activityPeriod } from '@/lib/format';

export interface ActivitiesSectionProps {
  activities: PublicActivity[];
  locale: SupportedLocale;
  muted?: boolean;
}

const year = (d: string | null) => (d ? d.slice(0, 4) : null);

export function ActivitiesSection({ activities, locale, muted }: ActivitiesSectionProps) {
  const t = useTranslations('sections.activities');
  // Activity type code, or 'all'. Types and labels come from master data.
  const [filter, setFilter] = useState<string>('all');

  if (!activities || activities.length === 0) return null;

  // Only offer filters that actually have entries.
  const types = [...new Map(activities.map((a) => [a.type.code, a.type])).values()];
  const filtered = filter === 'all' ? activities : activities.filter((a) => a.type.code === filter);

  // One block per organization, newest first inside each.
  const groups = [
    ...filtered
      .reduce((map, act) => {
        const key = act.organization?.slug ?? act.id;
        map.set(key, [...(map.get(key) ?? []), act]);
        return map;
      }, new Map<string, PublicActivity[]>())
      .values(),
  ].map((items) => items.sort((a, b) => (b.startDate ?? '').localeCompare(a.startDate ?? '')));

  return (
    <Section id="activities" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      {types.length > 1 ? (
        <div className="mb-8 flex flex-wrap gap-2">
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

      <div className="space-y-8">
        {groups.map((items) => {
          const org = items[0]!.organization;
          const years = items.flatMap((a) => [year(a.startDate), year(a.endDate)]).filter(Boolean).sort();
          const span = years.length ? `${years[0]}${years.at(-1) !== years[0] ? ` – ${years.at(-1)}` : ''}` : null;

          return (
            <SpotlightCard key={org?.slug ?? items[0]!.id} className="overflow-hidden">
              {/* Organization header */}
              <div className="bg-dot-matrix flex flex-wrap items-center gap-4 border-b border-border/70 bg-primary/5 p-5 sm:p-6">
                <OrgMark organization={org} fallback={items[0]!.eventName ?? ''} className="h-14 w-14 rounded-2xl text-lg" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-xl font-bold leading-tight text-foreground sm:text-2xl">
                    {org?.name}
                  </h3>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    {org?.type ? <span>{org.type.label}</span> : null}
                    {org?.location ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {org.location}
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex w-full gap-6 border-t border-border/60 pt-3 sm:w-auto sm:border-0 sm:pt-0 sm:text-right">
                  <div>
                    <p className="font-heading text-2xl font-bold text-primary">{items.length}</p>
                    <p className="text-xs text-muted-foreground">{t('roles')}</p>
                  </div>
                  {span ? (
                    <div>
                      <p className="font-heading text-2xl font-bold text-foreground">{span}</p>
                      <p className="text-xs text-muted-foreground">{t('years')}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Roles timeline */}
              <ol className="grid grid-cols-1 gap-x-8 p-5 sm:p-6 md:grid-cols-2">
                {items.map((act) => (
                  <li key={act.id} className="group relative border-l-2 border-primary/20 pb-6 pl-6 last:pb-0">
                    <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background transition-colors group-hover:bg-primary" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{activityPeriod(act, locale)}</span>
                      <Badge variant="secondary" className="text-[11px]">
                        {act.type.label}
                      </Badge>
                    </div>
                    <h4 className="mt-1.5 font-bold leading-snug text-foreground">
                      <Link
                        href={`/activities/${act.id}`}
                        className="after:absolute after:inset-0 hover:text-primary focus-visible:outline-none focus-visible:underline"
                      >
                        {act.role}
                        <ArrowUpRight className="ml-1 inline h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </h4>
                    {act.eventName ? (
                      <p className="mt-0.5 text-sm font-semibold text-primary">{act.eventName}</p>
                    ) : null}
                    {act.description ? (
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{act.description}</p>
                    ) : null}
                    {act.achievements.length > 0 ? (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        {act.achievements[0]}
                        {act.achievements.length > 1 ? ` +${act.achievements.length - 1}` : ''}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
