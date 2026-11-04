import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ImageMarquee } from '@/components/effects/image-marquee';
import { Section } from '@/components/layout/section';
import { ProjectGrid } from '@/components/project/project-grid';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type { PublicProjectCard } from '@/lib/api/types';
import { PORTFOLIO_SHOWCASE_IMAGES } from '@/lib/visuals';

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
      <div className="space-y-10">
        <ProjectGrid projects={projects} />

        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Interactive Visual Reel &amp; Architecture Snapshots
            </p>
          </div>
          <ImageMarquee items={PORTFOLIO_SHOWCASE_IMAGES} />
        </div>
      </div>
    </Section>
  );
}
