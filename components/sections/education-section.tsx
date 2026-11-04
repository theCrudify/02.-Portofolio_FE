import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          <Card key={edu.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <CardTitle>{edu.institution}</CardTitle>
                {edu.startDate ? (
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatMonthYear(edu.startDate, locale)}
                    {edu.endDate ? ` – ${formatMonthYear(edu.endDate, locale)}` : ''}
                  </span>
                ) : null}
              </div>
              <p className="text-sm font-medium text-primary">
                {[edu.degree, edu.field].filter(Boolean).join(' · ')}
                {edu.gpa ? (
                  <span className="ml-2 text-muted-foreground">
                    ({t('gpa')}: {edu.gpa}
                    {edu.gpaScale ? `/${edu.gpaScale}` : ''})
                  </span>
                ) : null}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {edu.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{edu.description}</p>
              ) : null}
              {edu.activities.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
                  {edu.activities.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
