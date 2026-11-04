import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/section';
import { ProjectGrid } from '@/components/project/project-grid';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type { PublicProjectCard } from '@/lib/api/types';

export interface ProjectsSectionProps {
  projects: PublicProjectCard[];
  muted?: boolean;
}

export function ProjectsSection({ projects, muted }: ProjectsSectionProps) {
  const t = useTranslations('sections.projects');
  if (!projects || projects.length === 0) return null;

  return (
    <Section
      id="projects"
      eyebrow={t('eyebrow')}
      title={t('title')}
      muted={muted}
      actions={
        <Link href="/projects" className={buttonVariants({ variant: 'outline' })}>
          <span>{t('viewAll')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <ProjectGrid projects={projects} />
    </Section>
  );
}

