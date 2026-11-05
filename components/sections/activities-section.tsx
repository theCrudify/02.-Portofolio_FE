'use client';

import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ListTree,
  MapPin,
  Route,
  Sparkles,
} from 'lucide-react';
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

function getRoleTier(role: string, index: number, locale: string) {
  const isEn = locale === 'en';
  const r = role.toLowerCase();
  if (r.includes('ketua') || r.includes('lead') || r.includes('chairman') || r.includes('president')) {
    return {
      label: isEn ? '🏆 Project Leadership' : '🏆 Puncak Kepemimpinan',
      shortLabel: isEn ? 'Lead' : 'Puncak',
      tier: isEn ? 'Tier 4: Executive Project Leadership' : 'Level 4: Kepemimpinan Eksekutif Proyek',
      icon: '🏆',
      isPeak: true,
    };
  }
  if (r.includes('kepala') || r.includes('head') || r.includes('koordinator') || r.includes('coordinator')) {
    return {
      label: isEn ? '👑 Division Head' : '👑 Pimpinan Divisi',
      shortLabel: isEn ? 'Head' : 'Kadiv',
      tier: isEn ? 'Tier 3: Division Management & Direction' : 'Level 3: Pengelolaan & Arahan Divisi',
      icon: '👑',
      isPeak: false,
    };
  }
  if (r.includes('web') || r.includes('tech') || r.includes('developer') || r.includes('sistem')) {
    return {
      label: isEn ? '💻 Technical & Web Engineering' : '💻 Teknis & Rekayasa Web',
      shortLabel: isEn ? 'Tech' : 'Teknis',
      tier: isEn ? 'Tier 2: Engineering & Digital Infrastructure' : 'Level 2: Implementasi Solusi & Rekayasa',
      icon: '💻',
      isPeak: false,
    };
  }
  if (r.includes('desain') || r.includes('design') || r.includes('publikasi') || r.includes('media')) {
    return {
      label: isEn ? '🎨 Creative & Media' : '🎨 Kreatif & Media',
      shortLabel: isEn ? 'Media' : 'Media',
      tier: isEn ? 'Tier 2: Visual Branding & Publications' : 'Level 2: Aset Visual & Branding Acara',
      icon: '🎨',
      isPeak: false,
    };
  }
  if (r.includes('dana') || r.includes('usaha') || r.includes('logistik') || r.includes('operasional')) {
    return {
      label: isEn ? '🌱 Operations & Support' : '🌱 Operasional & Organisasi',
      shortLabel: isEn ? 'Ops' : 'Staf',
      tier: isEn ? 'Tier 1: Foundational Operations' : 'Level 1: Fondasi Operasional Organisasi',
      icon: '🌱',
      isPeak: false,
    };
  }
  return {
    label: isEn ? `📌 Milestone Station 0${index + 1}` : `📌 Kontribusi Tahap 0${index + 1}`,
    shortLabel: isEn ? 'Member' : 'Staf',
    tier: isEn ? 'Tier 1: Committee Member' : 'Level 1: Anggota Tim Kepanitiaan',
    icon: '📌',
    isPeak: false,
  };
}

export function ActivitiesSection({ activities, locale, muted }: ActivitiesSectionProps) {
  const t = useTranslations('sections.activities');
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'timeline'>('map');
  const [activeStationIndex, setActiveStationIndex] = useState<number>(0);

  if (!activities || activities.length === 0) return null;

  // Types from master data
  const types = [...new Map(activities.map((a) => [a.type.code, a.type])).values()];
  const filtered = filter === 'all' ? activities : activities.filter((a) => a.type.code === filter);

  // Group by organization
  // For Journey progression, chronological order (earliest to latest) represents the growth path.
  const groups = [
    ...filtered
      .reduce((map, act) => {
        const key = act.organization?.slug ?? act.id;
        map.set(key, [...(map.get(key) ?? []), act]);
        return map;
      }, new Map<string, PublicActivity[]>())
      .values(),
  ].map((items) => items.sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? '')));

  return (
    <Section id="activities" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      {/* Controls Bar: Filters & View Switcher */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {types.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2">
            {[{ code: 'all', label: t('all') }, ...types].map((tab) => (
              <Button
                key={tab.code}
                type="button"
                size="sm"
                variant={filter === tab.code ? 'default' : 'outline'}
                onClick={() => {
                  setFilter(tab.code);
                  setActiveStationIndex(0);
                }}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* View Mode Switcher */}
        <div className="inline-flex self-start sm:self-auto items-center rounded-xl border border-border bg-muted/60 p-1 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              viewMode === 'map'
                ? 'bg-background text-primary shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Route className="h-3.5 w-3.5 text-primary" />
            <span>{t('mapView')}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              viewMode === 'timeline'
                ? 'bg-background text-primary shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListTree className="h-3.5 w-3.5 text-primary" />
            <span>{t('timelineView')}</span>
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {groups.map((items) => {
          const org = items[0]!.organization;
          const years = items.flatMap((a) => [year(a.startDate), year(a.endDate)]).filter(Boolean).sort();
          const span = years.length ? `${years[0]}${years.at(-1) !== years[0] ? ` – ${years.at(-1)}` : ''}` : null;
          const safeActiveIndex = Math.min(activeStationIndex, items.length - 1);
          const activeItem = items[safeActiveIndex] ?? items[0]!;
          const activeTier = getRoleTier(activeItem.role, safeActiveIndex, locale);
          const progressPercent = items.length > 1 ? (safeActiveIndex / (items.length - 1)) * 100 : 100;

          return (
            <SpotlightCard key={org?.slug ?? items[0]!.id} className="overflow-hidden">
              {/* Organization Header */}
              <div className="bg-dot-matrix flex flex-wrap items-center gap-4 border-b border-border/70 bg-primary/5 p-5 sm:p-6">
                <OrgMark
                  organization={org}
                  fallback={items[0]!.eventName ?? ''}
                  className="h-14 w-14 rounded-2xl text-lg shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-xl font-bold leading-tight text-foreground sm:text-2xl">
                      {org?.name}
                    </h3>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
                      <Sparkles className="mr-1 h-3 w-3" />
                      {t('journeyProgress')}
                    </Badge>
                  </div>
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

              {/* VIEW MODE 1: INTERACTIVE JOURNEY MAP / METRO TRACK */}
              {viewMode === 'map' ? (
                <div className="p-5 sm:p-8 space-y-6">
                  {/* Metro Stations Line */}
                  <div className="rounded-2xl border border-border/80 bg-background/60 p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {t('journeyProgress')}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        {t('stationProgress', {
                          current: String(safeActiveIndex + 1).padStart(2, '0'),
                          total: String(items.length).padStart(2, '0'),
                        })}{' '}
                        • {activeTier.shortLabel}
                      </span>
                    </div>

                    {/* Horizontal Metro Route */}
                    <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin">
                      <div className="min-w-[620px] relative px-6 py-2">
                        {/* Background track line */}
                        <div className="absolute left-8 right-8 top-6 h-1 bg-muted/80 rounded-full" />
                        {/* Active Progress gradient line */}
                        <div
                          className="absolute left-8 top-6 h-1 bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `calc(${progressPercent}% * 0.9 + 4px)` }}
                        />

                        {/* Station nodes */}
                        <div className="relative z-10 flex items-center justify-between w-full">
                          {items.map((act, idx) => {
                            const isCurrent = idx === safeActiveIndex;
                            const isPassed = idx < safeActiveIndex;
                            const tier = getRoleTier(act.role, idx, locale);

                            return (
                              <button
                                key={act.id}
                                type="button"
                                onClick={() => setActiveStationIndex(idx)}
                                className="group flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 transition-transform hover:scale-105"
                              >
                                <div
                                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-all duration-300 ${
                                    isCurrent
                                      ? 'border-background bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/30 scale-110'
                                      : isPassed
                                        ? 'border-primary bg-primary/20 text-primary'
                                        : 'border-border bg-card text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground'
                                  }`}
                                >
                                  {tier.isPeak ? (
                                    <span className="text-sm">🏆</span>
                                  ) : (
                                    <span>{String(idx + 1).padStart(2, '0')}</span>
                                  )}
                                </div>
                                <span
                                  className={`mt-2 font-mono text-[11px] whitespace-nowrap transition-colors ${
                                    isCurrent ? 'font-bold text-primary' : 'text-muted-foreground'
                                  }`}
                                >
                                  {activityPeriod(act, locale)}
                                </span>
                                <span className="mt-0.5 text-[11px] font-medium text-foreground max-w-[85px] truncate text-center hidden md:block">
                                  {tier.shortLabel}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Navigation bar between stations */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={safeActiveIndex === 0}
                        onClick={() => setActiveStationIndex((prev) => Math.max(0, prev - 1))}
                        className="gap-1 text-xs"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span>{t('prevStation')}</span>
                      </Button>
                      <p className="text-xs text-muted-foreground hidden sm:block text-center">
                        {t('stationHint')}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={safeActiveIndex === items.length - 1}
                        onClick={() => setActiveStationIndex((prev) => Math.min(items.length - 1, prev + 1))}
                        className="gap-1 text-xs"
                      >
                        <span>{t('nextStation')}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Active Station Detail Showcase Card */}
                  <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-card p-6 sm:p-8 shadow-md">
                    {/* Ambient subtle glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        {/* Badges strip */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/25">
                            {activityPeriod(activeItem, locale)}
                          </span>
                          <Badge variant="secondary" className="text-xs font-medium">
                            {activeItem.type.label}
                          </Badge>
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {activeTier.label}
                          </span>
                        </div>

                        {/* Title & Event */}
                        <div>
                          <h4 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                            <Link
                              href={`/activities/${activeItem.id}`}
                              className="group inline-flex items-center hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                            >
                              <span>{activeItem.role}</span>
                              <ArrowUpRight className="ml-2 h-5 w-5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                            </Link>
                          </h4>
                          {activeItem.eventName ? (
                            <p className="mt-1.5 text-base sm:text-lg font-bold text-primary">
                              {activeItem.eventName}
                            </p>
                          ) : null}
                        </div>

                        {/* Description */}
                        {activeItem.description ? (
                          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-3xl">
                            {activeItem.description}
                          </p>
                        ) : null}

                        {/* Achievements & Responsibilities */}
                        {activeItem.achievements && activeItem.achievements.length > 0 ? (
                          <div className="border-t border-border/60 pt-4 mt-4">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                              {t('keyAchievements')}
                            </h5>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-foreground">
                              {activeItem.achievements.map((ach, aIdx) => (
                                <li key={aIdx} className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                                  <span>{ach}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {/* Technologies / Tools tags if available */}
                        {activeItem.technologies && activeItem.technologies.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5 pt-2">
                            {activeItem.technologies.map((tech) => (
                              <Badge key={tech.slug} variant="outline" className="text-[11px] font-mono">
                                {tech.name}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      {/* Right Meta Telemetry Box */}
                      <div className="w-full lg:w-60 shrink-0 rounded-xl border border-border/80 bg-muted/40 p-4 space-y-3.5 text-xs">
                        <div>
                          <span className="text-muted-foreground block">{t('organization')}</span>
                          <span className="font-bold text-foreground text-sm">{org?.name}</span>
                        </div>
                        <div className="border-t border-border/60 pt-2.5">
                          <span className="text-muted-foreground block">{t('officialRecord')}</span>
                          <span className="font-semibold text-primary inline-flex items-center gap-1.5 mt-0.5">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            {t('officialRecord')}
                          </span>
                        </div>
                        <div className="border-t border-border/60 pt-2.5">
                          <span className="text-muted-foreground block">{t('roleLevel')}</span>
                          <span className="font-semibold text-foreground block mt-0.5">
                            {activeTier.tier}
                          </span>
                        </div>
                        <div className="border-t border-border/60 pt-2.5">
                          <Link
                            href={`/activities/${activeItem.id}`}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2 px-3 font-semibold text-foreground hover:bg-muted transition-colors text-center"
                          >
                            <span>{t('viewDetails')}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW MODE 2: CONNECTED STORYLINE ROADMAP */
                <div className="p-5 sm:p-8">
                  <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary/70 before:to-primary/20">
                    {items.map((act, idx) => {
                      const tier = getRoleTier(act.role, idx, locale);

                      return (
                        <div
                          key={act.id}
                          className="group relative rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                        >
                          {/* Timeline node beacon */}
                          <div className="absolute -left-[30px] sm:-left-[38px] top-6 flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            {tier.isPeak ? (
                              <span className="text-xs">🏆</span>
                            ) : (
                              <span className="font-mono text-[11px] font-bold">{idx + 1}</span>
                            )}
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                {activityPeriod(act, locale)}
                              </span>
                              <Badge variant="secondary" className="text-[11px]">
                                {act.type.label}
                              </Badge>
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                {tier.label}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-heading text-lg sm:text-xl font-bold leading-snug text-foreground">
                                <Link
                                  href={`/activities/${act.id}`}
                                  className="group/link inline-flex items-center hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                                >
                                  <span>{act.role}</span>
                                  <ArrowUpRight className="ml-1.5 h-4 w-4 opacity-0 transition-opacity group-hover/link:opacity-100" />
                                </Link>
                              </h4>
                              {act.eventName ? (
                                <p className="mt-0.5 text-sm font-semibold text-primary">
                                  {act.eventName}
                                </p>
                              ) : null}
                            </div>

                            {act.description ? (
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {act.description}
                              </p>
                            ) : null}

                            {act.achievements && act.achievements.length > 0 ? (
                              <ul className="pt-2 space-y-1.5 text-xs text-foreground">
                                {act.achievements.map((ach, aIdx) => (
                                  <li key={aIdx} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                                    <span>{ach}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
