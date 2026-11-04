import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { Badge } from '@/components/ui/badge';
import type { SiteData } from '@/lib/api/types';

export interface SkillsSectionProps {
  technologies: SiteData['technologies'];
  muted?: boolean;
}

export function SkillsSection({ technologies, muted }: SkillsSectionProps) {
  const t = useTranslations('sections.skills');

  const categories = [
    'frontend',
    'backend',
    'database',
    'devops',
    'tools',
    'soft_skill',
  ] as const;

  const nonEmpty = categories.filter((c) => (technologies[c]?.length ?? 0) > 0);
  if (nonEmpty.length === 0) return null;

  return (
    <Section id="skills" eyebrow={t('eyebrow')} title={t('title')} muted={muted}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {nonEmpty.map((cat) => (
          <div key={cat} className="rounded-md border border-border bg-card p-6">
            <h3 className="mb-4 text-base font-semibold text-foreground">{t(cat)}</h3>
            <div className="flex flex-wrap gap-2">
              {technologies[cat].map((tech) => (
                <Badge key={tech.slug} variant="secondary" className="px-3 py-1 text-xs">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
