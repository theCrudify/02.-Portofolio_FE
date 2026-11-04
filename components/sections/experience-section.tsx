import { useTranslations } from 'next-intl';
import { CareerTimeline } from '@/components/career/career-timeline';
import { Section } from '@/components/layout/section';
import type { PublicExperience, SupportedLocale } from '@/lib/api/types';

export interface ExperienceSectionProps {
  experiences: PublicExperience[];
  locale: SupportedLocale;
  muted?: boolean;
}

export function ExperienceSection({ experiences, locale, muted }: ExperienceSectionProps) {
  const t = useTranslations('sections.experience');
  if (!experiences || experiences.length === 0) return null;

  return (
    <Section
      id="experience"
      eyebrow={t('eyebrow')}
      title={t('title')}
      muted={muted}
      // overflow-hidden would break the sticky year navigation; clip only horizontally.
      className="overflow-visible overflow-x-clip"
    >
      <CareerTimeline experiences={experiences} locale={locale} />
    </Section>
  );
}
