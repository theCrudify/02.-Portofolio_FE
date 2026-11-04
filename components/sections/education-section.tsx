import { Award, CalendarDays, GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { OrgMark } from '@/components/sections/org-mark';
import type { PublicEducation, SupportedLocale } from '@/lib/api/types';
import { formatDuration, formatMonthYear } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface EducationSectionProps {
  education: PublicEducation[];
  locale: SupportedLocale;
  muted?: boolean;
}

export function EducationSection({ education, locale, muted }: EducationSectionProps) {
  const t = useTranslations('sections.education');
  if (!education || education.length === 0) return null;

  return (
    <Section id="education" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="space-y-6">
        {education.map((edu) => {
          const gpa = Number(edu.gpa);
          const scale = Number(edu.gpaScale) || 4;
          const gpaPct = edu.gpa && gpa > 0 ? Math.min(100, (gpa / scale) * 100) : null;
          const period = edu.startDate
            ? `${formatMonthYear(edu.startDate, locale)} – ${
                edu.endDate ? formatMonthYear(edu.endDate, locale) : t('present')
              }`
            : null;
          const duration = edu.startDate ? formatDuration(edu.startDate, edu.endDate, locale) : null;

          return (
            <SpotlightCard key={edu.id} className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]">
                {/* Main */}
                <div className="space-y-6 p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <OrgMark
                      organization={edu.organization}
                      className="h-16 w-16 rounded-2xl text-xl"
                    />
                    <div className="min-w-0 space-y-1.5">
                      <h3 className="font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                        {edu.organization?.name}
                      </h3>
                      <p className="flex items-center gap-2 text-sm font-semibold text-primary sm:text-base">
                        <GraduationCap className="h-4 w-4 shrink-0" />
                        {[edu.degree, edu.field].filter(Boolean).join(' · ')}
                      </p>
                      {period ? (
                        <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {period}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {edu.description ? (
                    <p className="max-w-[70ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {edu.description}
                    </p>
                  ) : null}

                  {edu.activities.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {t('campusActivities')}
                      </p>
                      <ol className="relative space-y-3 border-l-2 border-primary/20 pl-5">
                        {edu.activities.map((act, i) => (
                          <li key={i} className="relative text-sm text-foreground">
                            <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                            {act}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                </div>

                {/* Stats panel */}
                <div className="bg-dot-matrix flex flex-col justify-center gap-6 border-t border-border/70 bg-primary/5 p-6 sm:p-8 lg:border-l lg:border-t-0">
                  {gpaPct !== null ? (
                    <div className="space-y-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        <Award className="h-4 w-4 text-primary" />
                        {t('gpa')}
                      </p>
                      <p className="font-heading text-5xl font-bold leading-none text-foreground">
                        {edu.gpa}
                        <span className="ml-1 text-lg font-semibold text-muted-foreground">
                          / {edu.gpaScale ?? '4.00'}
                        </span>
                      </p>
                      <div
                        className="h-2 w-full overflow-hidden rounded-full bg-primary/15"
                        role="progressbar"
                        aria-valuenow={gpa}
                        aria-valuemin={0}
                        aria-valuemax={scale}
                        aria-label={t('gpa')}
                      >
                        <div className="h-full rounded-full bg-primary" style={{ width: `${gpaPct}%` }} />
                      </div>
                    </div>
                  ) : null}

                  <dl className={cn('grid grid-cols-2 gap-4 text-sm', gpaPct !== null && 'border-t border-border/70 pt-5')}>
                    {duration ? (
                      <div>
                        <dt className="text-xs text-muted-foreground">{t('duration')}</dt>
                        <dd className="mt-1 font-semibold text-foreground">{duration}</dd>
                      </div>
                    ) : null}
                    {edu.degree ? (
                      <div>
                        <dt className="text-xs text-muted-foreground">{t('degree')}</dt>
                        <dd className="mt-1 font-semibold text-foreground">{edu.degree.split(',')[0]}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
