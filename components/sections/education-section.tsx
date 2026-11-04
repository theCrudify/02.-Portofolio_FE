import { Award, CheckCircle2, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PublicEducation, SupportedLocale } from '@/lib/api/types';
import { formatMonthYear } from '@/lib/format';

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {education.map((edu) => (
          <SpotlightCard key={edu.id} className="group flex flex-col justify-between overflow-hidden">
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

              <CardHeader className="space-y-2 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="secondary" className="gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    <span>{[edu.degree, edu.field].filter(Boolean).join(' · ')}</span>
                  </Badge>
                  {edu.startDate ? (
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatMonthYear(edu.startDate, locale)}
                      {edu.endDate ? ` – ${formatMonthYear(edu.endDate, locale)}` : ''}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <CardTitle className="text-xl">{edu.institution}</CardTitle>
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

              <CardContent className="space-y-4">
                {edu.description ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">{edu.description}</p>
                ) : null}
                {edu.activities.length > 0 ? (
                  <ul className="space-y-2">
                    {edu.activities.map((act, aIdx) => (
                      <li
                        key={aIdx}
                        className="flex items-start gap-2 rounded-lg border border-border/70 bg-background/70 p-2.5 text-xs font-medium text-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
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
