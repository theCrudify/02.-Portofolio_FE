import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ImageMarquee } from '@/components/effects/image-marquee';
import { Section } from '@/components/layout/section';
import {
  MultiImageShowcase,
  type ShowcaseImageEntry,
} from '@/components/media/multi-image-showcase';
import { ProjectGrid } from '@/components/project/project-grid';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type { PublicProjectCard } from '@/lib/api/types';
import type { VisualShowcaseItem } from '@/lib/visuals';

export interface ProjectsSectionProps {
  projects: PublicProjectCard[];
  muted?: boolean;
}

export function ProjectsSection({ projects, muted }: ProjectsSectionProps) {
  const t = useTranslations('sections.projects');
  if (!projects || projects.length === 0) return null;

  const galleryItems: ShowcaseImageEntry[] = [];
  const marqueeItems: VisualShowcaseItem[] = [];

  for (const proj of projects) {
    if (proj.images && proj.images.length > 0) {
      proj.images.forEach((img, idx) => {
        galleryItems.push({
          id: `${proj.slug}-img-${idx}`,
          url: img.url,
          alt: img.alt || proj.title,
          title: proj.title,
          caption: img.caption ?? proj.summary,
          category: proj.type.replace('_', ' '),
          width: img.width,
          height: img.height,
        });
      });
    } else if (proj.cover) {
      galleryItems.push({
        id: `${proj.slug}-cover`,
        url: proj.cover.url,
        alt: proj.cover.alt || proj.title,
        title: proj.title,
        caption: proj.summary,
        category: proj.type.replace('_', ' '),
        width: proj.cover.width,
        height: proj.cover.height,
      });
    }

    if (proj.cover) {
      marqueeItems.push({
        id: `marquee-${proj.slug}`,
        url: proj.cover.url,
        alt: proj.cover.alt || proj.title,
        title: proj.title,
        caption: proj.summary,
        category: proj.type.replace('_', ' '),
        width: proj.cover.width,
        height: proj.cover.height,
      });
    }
  }

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

        {galleryItems.length > 1 ? (
          <div className="rounded-2xl border border-border/80 bg-card/75 p-6 shadow-sm backdrop-blur-md md:p-8">
            <h3 className="mb-5 font-heading text-xl font-bold text-foreground md:text-2xl">
              {t('gallery')}
            </h3>
            <MultiImageShowcase items={galleryItems} defaultLayout="bento" />
          </div>
        ) : null}

        {marqueeItems.length > 1 ? <ImageMarquee items={marqueeItems} /> : null}
      </div>
    </Section>
  );
}
