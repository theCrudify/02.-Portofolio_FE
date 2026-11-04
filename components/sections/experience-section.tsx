import { Briefcase, Building2, CheckCircle2, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
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
      <div className="space-y-6">
        {experiences.map((exp, idx) => (
          <SpotlightCard key={exp.id} className="overflow-hidden p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="bg-dot-matrix flex flex-col justify-between space-y-4 rounded-xl border border-border/80 bg-background/75 p-5 lg:col-span-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="default" className="gap-1.5 font-mono">
                      <Briefcase className="h-3 w-3" />
                      <span>{String(idx + 1).padStart(2, '0')}</span>
                    </Badge>
                    <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs font-medium text-foreground">
                      {formatPeriod(exp.startDate, exp.endDate, locale)}
                    </span>
                  </div>

                  {exp.companyLogo ? (
                    <div className="relative aspect-16/7 w-full overflow-hidden rounded-lg border border-border bg-muted">
                      <Image
                        src={exp.companyLogo.url}
                        alt={exp.companyLogo.alt || exp.company}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="space-y-1.5">
                    <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                      {exp.role}
                    </h3>
                    <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span>{exp.company}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-3.5">
                  {exp.location ? (
                    <Badge variant="outline" className="gap-1 bg-card text-xs">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span>{exp.location}</span>
                    </Badge>
                  ) : null}
                  {exp.workMode ? (
                    <Badge variant="secondary" className="capitalize">
                      {exp.workMode}
                    </Badge>
                  ) : null}
                  {exp.employmentType ? (
                    <Badge variant="outline" className="bg-card capitalize">
                      {exp.employmentType.replace('_', ' ')}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-5 lg:col-span-8">
                <div className="space-y-5">
                  {exp.description ? (
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>
                  ) : null}

                  {exp.achievements.length > 0 ? (
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {exp.achievements.map((item, aIdx) => (
                        <li
                          key={aIdx}
                          className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-background/80 p-3.5 text-sm leading-relaxed text-foreground shadow-2xs"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {exp.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2 border-t border-border/70 pt-4">
                    {exp.technologies.map((tech) => (
                      <Badge
                        key={tech.slug}
                        variant="outline"
                        className="border-primary/25 bg-background/90 px-3 py-1 text-xs font-medium"
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
