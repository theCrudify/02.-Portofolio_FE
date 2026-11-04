import { Briefcase, CheckCircle2, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import type { PublicExperience, SupportedLocale } from '@/lib/api/types';
import { formatPeriod } from '@/lib/format';
import { cn } from '@/lib/utils';

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
          <SpotlightCard key={exp.id} className="overflow-hidden p-6 md:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div
                className={cn(
                  'space-y-4',
                  exp.companyLogo ? 'lg:col-span-8' : 'lg:col-span-12',
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default" className="gap-1.5 font-mono">
                      <Briefcase className="h-3 w-3" />
                      <span>{String(idx + 1).padStart(2, '0')}</span>
                    </Badge>
                    {exp.workMode ? (
                      <Badge variant="secondary" className="capitalize">
                        {exp.workMode}
                      </Badge>
                    ) : null}
                    {exp.employmentType ? (
                      <Badge variant="outline" className="capitalize">
                        {exp.employmentType.replace('_', ' ')}
                      </Badge>
                    ) : null}
                  </div>
                  <span className="rounded-full border border-border bg-muted/60 px-3 py-1 font-mono text-xs text-foreground">
                    {formatPeriod(exp.startDate, exp.endDate, locale)}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground md:text-2xl">
                    {exp.role}
                  </h3>
                  <p className="mt-1 inline-flex flex-wrap items-center gap-2 text-sm font-semibold text-primary">
                    <span>{exp.company}</span>
                    {exp.location ? (
                      <span className="inline-flex items-center gap-1 font-normal text-muted-foreground">
                        · <MapPin className="h-3.5 w-3.5" /> {exp.location}
                      </span>
                    ) : null}
                  </p>
                </div>

                {exp.description ? (
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>
                ) : null}

                {exp.achievements.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-2 pt-1 md:grid-cols-2">
                    {exp.achievements.map((item, aIdx) => (
                      <li
                        key={aIdx}
                        className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-background/70 p-3 text-sm leading-relaxed text-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {exp.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech.slug} variant="outline" className="bg-background/80 text-xs">
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>

              {exp.companyLogo ? (
                <div className="flex items-center justify-center lg:col-span-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
                    <Image
                      src={exp.companyLogo.url}
                      alt={exp.companyLogo.alt || exp.company}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
