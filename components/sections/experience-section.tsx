import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import type { PublicExperience, SupportedLocale } from '@/lib/api/types';
import { formatPeriod } from '@/lib/format';

export interface ExperienceSectionProps {
  experiences: PublicExperience[];
  locale: SupportedLocale;
  muted?: boolean;
}

export function ExperienceSection({ experiences, locale, muted }: ExperienceSectionProps) {
  const t = useTranslations('sections.experience');
  if (!experiences || experiences.length === 0) return null;

  return (
    <Section id="experience" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="relative space-y-8 border-l-2 border-border pl-6 md:pl-8">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative space-y-3">
            <span className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background md:-left-[39px]" />

            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
              <div>
                <h3 className="text-lg font-semibold text-foreground md:text-xl">{exp.role}</h3>
                <p className="text-sm font-medium text-primary">
                  {exp.company}
                  {exp.location ? (
                    <span className="font-normal text-muted-foreground"> · {exp.location}</span>
                  ) : null}
                  {exp.workMode ? (
                    <span className="font-normal capitalize text-muted-foreground">
                      {' '}
                      ({exp.workMode})
                    </span>
                  ) : null}
                </p>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {formatPeriod(exp.startDate, exp.endDate, locale)}
              </p>
            </div>

            {exp.description ? (
              <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
                {exp.description}
              </p>
            ) : null}

            {exp.achievements.length > 0 ? (
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground">
                {exp.achievements.map((item, idx) => (
                  <li key={idx} className="max-w-[65ch]">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {exp.technologies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {exp.technologies.map((tech) => (
                  <Badge key={tech.slug} variant="outline" className="text-xs font-normal">
                    {tech.name}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}

