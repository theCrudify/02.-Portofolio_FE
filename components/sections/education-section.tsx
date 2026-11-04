import { Award, CheckCircle2, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PublicEducation, SupportedLocale } from '@/lib/api/types';
import { formatMonthYear } from '@/lib/format';
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
      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          education.length === 1 ? 'lg:grid-cols-1' : 'md:grid-cols-2',
        )}
      >
        {education.map((edu) => (
          <SpotlightCard
            key={edu.id}
            className="group flex flex-col justify-between overflow-hidden"
          >
            <div>
              {edu.logo ? (
                <div className="relative aspect-16/7 w-full overflow-hidden border-b border-border/80 bg-muted">
                  <Image
                    src={edu.logo.url}
                    alt={edu.logo.alt || edu.institution}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : null}

              <CardHeader className="bg-dot-matrix space-y-2.5 border-b border-border/60 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="secondary" className="gap-1.5 border border-primary/25 bg-primary/10 text-foreground">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    <span>{[edu.degree, edu.field].filter(Boolean).join(' · ')}</span>
                  </Badge>
                  {edu.startDate ? (
                    <span className="rounded-full border border-border bg-background/85 px-3 py-1 font-mono text-xs text-muted-foreground">
                      {formatMonthYear(edu.startDate, locale)}
                      {edu.endDate ? ` – ${formatMonthYear(edu.endDate, locale)}` : ''}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <CardTitle className="text-xl sm:text-2xl">{edu.institution}</CardTitle>
                  {edu.gpa ? (
                    <Badge variant="default" className="gap-1">
                      <Award className="h-3 w-3" />
                      <span>
                        {t('gpa')}: {edu.gpa}
                        {edu.gpaScale ? `/${edu.gpaScale}` : ''}
                      </span>
                    </Badge>
                  ) : null}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-5">
                {edu.description ? (
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {edu.description}
                  </p>
                ) : null}
                {edu.activities.length > 0 ? (
                  <ul
                    className={cn(
                      'grid grid-cols-1 gap-2.5',
                      education.length === 1 ? 'sm:grid-cols-2' : 'grid-cols-1',
                    )}
                  >
                    {edu.activities.map((act, aIdx) => (
                      <li
                        key={aIdx}
                        className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-background/80 p-3 text-xs font-medium text-foreground sm:text-sm"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
