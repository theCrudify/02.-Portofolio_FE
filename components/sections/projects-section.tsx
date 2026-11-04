import { ArrowRight, Images } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ImageMarquee } from '@/components/effects/image-marquee';
import { Section } from '@/components/layout/section';
import { MultiImageShowcase } from '@/components/media/multi-image-showcase';
import { ProjectGrid } from '@/components/project/project-grid';
import { Badge } from '@/components/ui/badge';
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
        <Link href="/projects" className={buttonVariants({ variant: 'default' })}>
          <span>{t('viewAll')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="space-y-12">
        <ProjectGrid projects={projects} />

        {/* Interactive Multi-Image Bento Gallery directly on Homepage */}
        <div className="space-y-5 rounded-2xl border border-border/80 bg-card/75 p-6 shadow-sm backdrop-blur-md md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                <Images className="h-3.5 w-3.5" />
                <span>Interactive Multi-Image Gallery</span>
              </div>
              <h3 className="mt-1 font-heading text-xl font-bold text-foreground md:text-2xl">
                System Architecture, Interfaces &amp; Production Snapshots
              </h3>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              BENTO · GRID · SHOWCASE
            </Badge>
          </div>

          <MultiImageShowcase items={PORTFOLIO_SHOWCASE_IMAGES} defaultLayout="bento" />
        </div>

        {/* Continuous Horizontal Multi-Image Visual Reel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              LIVE STREAM // ARCHITECTURE &amp; INTERFACE REEL
            </p>
          </div>
          <ImageMarquee items={PORTFOLIO_SHOWCASE_IMAGES} />
        </div>
      </div>
    </Section>
  );
}
