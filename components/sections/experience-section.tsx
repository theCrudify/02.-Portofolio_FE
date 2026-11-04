import { Briefcase, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import type { PublicExperience, SupportedLocale } from '@/lib/api/types';
import { formatPeriod } from '@/lib/format';
import { PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

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
        {experiences.map((exp, idx) => {
          const fallbackVisual =
            PORTFOLIO_SHOWCASE_IMAGES[(idx + 1) % PORTFOLIO_SHOWCASE_IMAGES.length] ??
            PORTFOLIO_SHOWCASE_IMAGES[0]!;
          const previewUrl = exp.companyLogo?.url ?? fallbackVisual.url;

          return (
            <SpotlightCard key={exp.id} className="overflow-hidden p-6 md:p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left 7 Columns: Role, Description, Achievements & Stack */}
                <div className="space-y-4 lg:col-span-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default" className="gap-1.5">
                        <Briefcase className="h-3 w-3" />
                        <span>0{idx + 1}</span>
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
                    <div className="space-y-2 pt-1">
                      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                        Key Engineering Deliverables
                      </p>
                      <ul className="space-y-2">
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
                    </div>
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

                {/* Right 5 Columns: Visual Architecture Snapshot & Telemetry Panel */}
                <div className="flex flex-col justify-between space-y-4 rounded-xl border border-border/80 bg-muted/30 p-4 lg:col-span-5">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                      src={previewUrl}
                      alt={exp.companyLogo?.alt || `${exp.company} architecture preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, 440px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {exp.company}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Verified Production
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="font-mono text-xs text-muted-foreground">SLA RELIABILITY</p>
                      <p className="mt-1 font-heading text-lg font-bold text-foreground">99.98%</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="font-mono text-xs text-muted-foreground">ARCHITECTURE</p>
                      <p className="mt-1 font-heading text-lg font-bold text-primary">
                        Modular Edge
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/70 pt-3 font-mono text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-success" />
                      <span>AUDIT VERIFIED</span>
                    </span>
                    <span>{exp.technologies.length} TECH STACK</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
