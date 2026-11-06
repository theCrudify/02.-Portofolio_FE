'use client';

import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FolderGit2,
  ListChecks,
  MapPin,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChibiGuide, type ChibiPose } from '@/components/career/chibi-guide';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type { PublicExperience, SupportedLocale } from '@/lib/api/types';
import { formatPeriod } from '@/lib/format';
import { cn } from '@/lib/utils';

/** Rendered size (px) of the guide sprite; used to keep it inside the track. */
const GUIDE_SIZE = 104;
const GUIDE_STORAGE_KEY = 'career-guide-visible';

export interface CareerTimelineProps {
  experiences: PublicExperience[];
  locale: SupportedLocale;
}

function yearOf(dateStr: string): number {
  return new Date(dateStr).getUTCFullYear();
}

export function CareerTimeline({ experiences, locale }: CareerTimelineProps) {
  const t = useTranslations('sections.experience');
  const reduceMotion = useReducedMotion();

  // Chronological: the guide walks from the first job toward the present.
  const milestones = useMemo(
    () =>
      [...experiences].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      ),
    [experiences],
  );

  const yearAnchors = useMemo(() => {
    const anchors: { year: number; index: number }[] = [];
    milestones.forEach((m, index) => {
      const year = yearOf(m.startDate);
      if (!anchors.some((a) => a.year === year)) anchors.push({ year, index });
    });
    return anchors;
  }, [milestones]);

  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [walking, setWalking] = useState(false);
  const [hopping, setHopping] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [movingUp, setMovingUp] = useState(false);
  const [guideVisible, setGuideVisible] = useState(true);

  // --- Scroll-driven track fill + guide position ---------------------------
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 60%', 'end 60%'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const fillHeight = useTransform(smoothProgress, (v) => `${v * 100}%`);
  const guideTop = useTransform(smoothProgress, (v) => `calc(${v * 100}% - ${v * GUIDE_SIZE}px)`);

  // --- Walking detection: walk while scrolling, rest when scrolling stops --
  const stopTimer = useRef<number | null>(null);
  const lastProgress = useRef(0);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const delta = value - lastProgress.current;
    lastProgress.current = value;
    if (reduceMotion || Math.abs(delta) < 0.0004) return;

    setMovingUp(delta < 0);
    setWalking(true);
    if (stopTimer.current) window.clearTimeout(stopTimer.current);
    stopTimer.current = window.setTimeout(() => setWalking(false), 260);
  });

  useEffect(
    () => () => {
      if (stopTimer.current) window.clearTimeout(stopTimer.current);
    },
    [],
  );

  // --- Active milestone = card crossing the middle of the viewport ---------
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const nodes = itemRefs.current.filter((n): n is HTMLLIElement => n !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveIndex(Number((entry.target as HTMLElement).dataset.index ?? 0));
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [milestones.length]);

  // --- Guide visibility preference ----------------------------------------
  useEffect(() => {
    const stored = window.localStorage.getItem(GUIDE_STORAGE_KEY);
    if (stored === 'false') setGuideVisible(false);
  }, []);

  const toggleGuide = () => {
    setGuideVisible((prev) => {
      window.localStorage.setItem(GUIDE_STORAGE_KEY, String(!prev));
      return !prev;
    });
  };

  const scrollToMilestone = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), milestones.length - 1);
      itemRefs.current[clamped]?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    },
    [milestones.length, reduceMotion],
  );

  if (milestones.length === 0) return null;

  const active = milestones[activeIndex] ?? milestones[0]!;
  const activeYear = yearOf(active.startDate);

  const DEV_QUOTES = useMemo(
    () => [
      active.description || 'Scroll terus untuk menjelajahi seluruh jejak rekam karier Jidan!',
      'Membangun fondasi arsitektur enterprise modular & scalable!',
      'Integrasi sistem kompleks: SAP, Bea Cukai CEISA, & auto-payment!',
      '100% type-safe TypeScript, clean database schema & index optimal!',
      'Ingin berdiskusi atau kolaborasi proyek? Kirim pesan lewat form kontak ya! ✨',
    ],
    [active.description],
  );

  const handleGuideClick = useCallback(() => {
    setHopping(true);
    setQuoteIndex((prev) => (prev + 1) % 5);
    setTimeout(() => setHopping(false), 550);
  }, []);

  // Resting reaction per milestone: greet at the start, code at the current
  // job, and present (point at the card) for everything in between.
  const restingPose: ChibiPose =
    activeIndex === 0 ? 'wave' : active.endDate === null ? 'laptop' : 'point';
  const pose: ChibiPose = walking ? 'walk-a' : restingPose;
  // Sprites face right; the "point" sprite points left, so mirror it to point at the cards.
  const flipped = walking ? movingUp : restingPose === 'point';

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      {/* ---------------- Sticky track navigation ---------------- */}
      <aside className="lg:col-span-3">
        <div className="sticky top-20 z-20 -mx-4 space-y-4 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border lg:top-28 lg:border-border/70 lg:bg-card/70 lg:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t('jumpToYear')}
            </p>
            <span className="font-mono text-xs font-bold text-primary">
              {String(activeIndex + 1).padStart(2, '0')} / {String(milestones.length).padStart(2, '0')}
            </span>
          </div>

          <nav
            aria-label={t('jumpToYear')}
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {yearAnchors.map(({ year, index }) => {
              const isActive = year === activeYear;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => scrollToMilestone(index)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-left font-mono text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'hidden h-px transition-all lg:block',
                      isActive ? 'w-8 bg-primary-foreground' : 'w-4 bg-border group-hover:w-6',
                    )}
                  />
                  <span>{year}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center justify-between gap-2 border-t border-border/70 pt-4 lg:flex">
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label={t('prevMilestone')}
                disabled={activeIndex === 0}
                onClick={() => scrollToMilestone(activeIndex - 1)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label={t('nextMilestone')}
                disabled={activeIndex === milestones.length - 1}
                onClick={() => scrollToMilestone(activeIndex + 1)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={toggleGuide}
              aria-pressed={guideVisible}
            >
              {guideVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{guideVisible ? t('hideGuide') : t('showGuide')}</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* ---------------- Track + milestones ---------------- */}
      <div className="lg:col-span-9">
        <div ref={trackRef} className="relative">
          {/* Rail */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-4 w-px bg-border sm:left-14"
          />
          {/* Progress fill */}
          <motion.div
            aria-hidden="true"
            style={{ height: fillHeight }}
            className="absolute top-0 left-4 w-[3px] -translate-x-px rounded-full bg-gradient-to-b from-primary/40 via-primary to-primary shadow-[0_0_12px_var(--primary)] sm:left-14"
          />

          {/* Walking guide */}
          {guideVisible ? (
            <motion.div
              style={{ top: guideTop, width: GUIDE_SIZE, height: GUIDE_SIZE }}
              className="pointer-events-auto absolute left-14 z-20 hidden -translate-x-1/2 sm:block cursor-pointer"
            >
              {!walking ? (
                <div
                  key={`${active.id}-${quoteIndex}`}
                  className="chibi-bubble absolute bottom-full left-1/2 mb-2 w-52 -translate-x-1/2 rounded-2xl border border-primary/30 bg-popover/95 p-2.5 text-center text-xs shadow-xl backdrop-blur-sm transition-transform hover:scale-105"
                  onClick={handleGuideClick}
                >
                  <div className="flex items-center justify-between gap-1 mb-1 border-b border-border/50 pb-1">
                    <span className="font-heading text-[10px] font-bold text-primary flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {t('guideTitle')}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {String(activeIndex + 1).padStart(2, '0')}/{String(milestones.length).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="font-bold text-foreground line-clamp-1 text-xs">
                    {active.role}
                  </p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                    {DEV_QUOTES[quoteIndex] || active.organization?.name}
                  </p>
                  <div className="mt-1.5 pt-1 border-t border-border/40 flex items-center justify-center gap-1 text-[10px] font-medium text-primary">
                    <span>{t('tapGuideHint')}</span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-r border-b border-primary/30 bg-popover"
                  />
                </div>
              ) : null}
              <ChibiGuide
                pose={pose}
                flipped={flipped}
                walking={walking}
                hopping={hopping}
                onClick={handleGuideClick}
                alt={t('guideAlt')}
                className="h-full w-full"
              />
            </motion.div>
          ) : null}

          <ol className="space-y-10 pl-12 sm:space-y-14 sm:pl-36">
            {milestones.map((exp, index) => {
              const isActive = index === activeIndex;
              const isPassed = index < activeIndex;
              const isCurrentJob = exp.endDate === null;

              return (
                <li
                  key={exp.id}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  data-index={index}
                  className="relative scroll-mt-32"
                >
                  {/* Node on the rail */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-7 left-[-32px] flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-all duration-300 sm:left-[-88px]',
                      isActive
                        ? 'scale-125 border-primary bg-primary shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary)_20%,transparent)]'
                        : isPassed
                          ? 'border-primary bg-background'
                          : 'border-border bg-background',
                    )}
                  >
                    {isCurrentJob ? (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                    ) : null}
                  </span>

                  <article
                    className={cn(
                      // relative: the title link stretches over the whole card
                      'relative rounded-2xl border p-5 transition-all duration-500 hover:border-primary/60 sm:p-7',
                      isActive
                        ? 'border-primary/40 bg-card shadow-xl'
                        : 'border-transparent bg-transparent opacity-70 hover:opacity-100',
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {formatPeriod(exp.startDate, exp.endDate, locale)}
                      </span>
                      {isCurrentJob ? (
                        <Badge className="h-5 gap-1 px-2 text-[10px] uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                          {t('now')}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-start gap-4">
                      {exp.organization?.logo ? (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                          <Image
                            src={exp.organization.logo.url}
                            alt={exp.organization.logo.alt || exp.organization.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1.5"
                          />
                        </div>
                      ) : null}
                      <div className="min-w-0">
                        <h3 className="font-heading text-xl font-bold leading-tight text-foreground sm:text-2xl">
                          <Link
                            href={`/experience/${exp.id}`}
                            className="rounded-sm transition-colors after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {exp.role}
                          </Link>
                        </h3>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                            <Building2 className="h-4 w-4 text-primary" />
                            {exp.organization?.websiteUrl ? (
                              <a
                                href={exp.organization.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative z-10 hover:text-primary hover:underline"
                              >
                                {exp.organization.name}
                              </a>
                            ) : (
                              exp.organization?.name
                            )}
                          </span>
                          {exp.location ? (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {exp.location}
                            </span>
                          ) : null}
                          {exp.workMode ? <span>{exp.workMode.label}</span> : null}
                          <span>{exp.employmentType.label}</span>
                        </p>
                      </div>
                    </div>

                    {exp.description ? (
                      <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-muted-foreground">
                        {exp.description}
                      </p>
                    ) : null}

                    {exp.responsibilities.length > 0 ? (
                      <div className="mt-5">
                        <h4 className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                          <ListChecks className="h-3.5 w-3.5" />
                          {t('responsibilities')}
                        </h4>
                        <ul className="max-w-[75ch] space-y-2.5">
                          {exp.responsibilities.map((item, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground sm:text-[15px]">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {exp.achievements.length > 0 ? (
                      <div className="mt-5">
                        <h4 className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-success">
                          <Trophy className="h-3.5 w-3.5" />
                          {t('achievements')}
                        </h4>
                        <ul className="max-w-[75ch] space-y-2.5">
                          {exp.achievements.map((item, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground sm:text-[15px]">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {exp.projects.length > 0 ? (
                      <div className="mt-5">
                        <h4 className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          <FolderGit2 className="h-3.5 w-3.5" />
                          {t('projectsInRole')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.projects.map((p) => (
                            <Link
                              key={p.slug}
                              href={`/projects/${p.slug}`}
                              className="relative z-10 inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border bg-background/80 px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <span>{p.title}</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {exp.technologies.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech.slug}
                            className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5">
                      <Link
                        href={`/experience/${exp.id}`}
                        tabIndex={-1}
                        className="relative z-10 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border bg-background/80 px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {t('details')}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

