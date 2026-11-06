import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import {
  DetailArticle,
  DetailBulletList,
  DetailFacts,
  DetailFigure,
  DetailHeader,
  DetailNumberedList,
  DetailPager,
  DetailProse,
  DetailRowList,
  DetailSection,
  DetailSections,
  DetailTechList,
  type DetailFact,
  type DetailNavItem,
} from '@/components/detail/detail-layout';
import { MultiImageShowcase } from '@/components/media/multi-image-showcase';
import { ProjectLinks } from '@/components/project/project-links';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type {
  PublicImage,
  PublicOrganization,
  PublicPortfolioExtras,
  PublicProjectRef,
} from '@/lib/api/types';
import { cn } from '@/lib/utils';

export type { DetailFact, DetailNavItem };

/** "View details" link on a certificate / activity / award card. */
export function DetailLink({ href }: { href: string }) {
  const t = useTranslations('sections.extras');
  return (
    <div className="border-t border-border/60 px-5 py-3">
      <Link href={href} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'min-h-11')}>
        {t('details')}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export interface PortfolioDetailPageProps extends Partial<PublicPortfolioExtras> {
  title: string;
  /** Line under the organization (event name…); don't repeat the organization here. */
  subtitle?: string | null;
  /** Kind labels shown above the title (type, rank, status). */
  badges?: (string | null | undefined)[];
  backHref: string;
  backLabel: string;
  /** Used as the analytics target id for link clicks. */
  trackId: string;
  cover?: PublicImage | null;
  /** Certificates and scans are shown whole instead of cropped. */
  coverFit?: 'cover' | 'contain';
  /** Key facts strip (period, credential id…); empty values are skipped. */
  facts?: DetailFact[];
  organization?: PublicOrganization | null;
  description?: string | null;
  /** Work experience only: job description bullets, shown before achievements. */
  responsibilities?: string[];
  responsibilitiesTitle?: string;
  achievementsTitle?: string;
  /** Work experience only: projects delivered in this role (links to their case studies). */
  projects?: PublicProjectRef[];
  projectsTitle?: string;
  /** Extra actions (verify credential, external link…). */
  actions?: ReactNode;
  prev?: DetailNavItem | null;
  next?: DetailNavItem | null;
}

export function PortfolioDetailPage({
  title,
  subtitle,
  badges = [],
  backHref,
  backLabel,
  trackId,
  cover,
  coverFit = 'cover',
  facts = [],
  organization,
  description,
  responsibilities = [],
  responsibilitiesTitle,
  achievements = [],
  achievementsTitle,
  projects = [],
  projectsTitle,
  technologies = [],
  attachments = [],
  links = [],
  actions,
  prev,
  next,
}: PortfolioDetailPageProps) {
  const t = useTranslations('sections.extras');
  const images = attachments.filter((a) => a.kind === 'image');
  const documents = attachments.filter((a) => a.kind !== 'image');
  const isEmpty =
    !description &&
    !responsibilities.length &&
    !achievements.length &&
    !projects.length &&
    !attachments.length &&
    !technologies.length;
  const headerActions =
    actions || links.length ? (
      <>
        {actions}
        <ProjectLinks links={links} projectSlug={trackId} privateLabel={t('private')} />
      </>
    ) : null;

  return (
    <DetailArticle>
      <DetailHeader
        backHref={backHref}
        backLabel={backLabel}
        eyebrow={badges}
        title={title}
        organization={organization}
        byline={subtitle}
        actions={headerActions}
      />

      <DetailFacts facts={facts} />
      {cover ? <DetailFigure image={cover} alt={title} contain={coverFit === 'contain'} /> : null}

      <DetailSections>
        {description ? (
          <DetailSection title={t('description')}>
            <DetailProse>{description}</DetailProse>
          </DetailSection>
        ) : null}

        {responsibilities.length > 0 ? (
          <DetailSection title={responsibilitiesTitle ?? t('responsibilities')}>
            <DetailBulletList items={responsibilities} />
          </DetailSection>
        ) : null}

        {achievements.length > 0 ? (
          <DetailSection title={achievementsTitle ?? t('achievements')}>
            <DetailNumberedList items={achievements} />
          </DetailSection>
        ) : null}

        {projects.length > 0 ? (
          <DetailSection title={projectsTitle ?? t('projects')}>
            <DetailRowList
              rows={projects.map((p) => ({ key: p.slug, href: `/projects/${p.slug}`, title: p.title }))}
            />
          </DetailSection>
        ) : null}

        {images.length > 0 ? (
          <DetailSection title={t('gallery')}>
            <MultiImageShowcase
              defaultLayout={images.length > 2 ? 'bento' : 'grid'}
              items={images.map((img, i) => ({
                id: img.id,
                url: img.url,
                alt: img.alt || img.caption || `${title} ${i + 1}`,
                title: img.caption ?? img.title,
                caption: img.caption,
                width: img.width,
                height: img.height,
              }))}
            />
          </DetailSection>
        ) : null}

        {documents.length > 0 ? (
          <DetailSection title={t('documents')}>
            <DetailRowList
              rows={documents.map((doc) => ({
                key: doc.id,
                href: doc.url,
                title: doc.caption || doc.title || t('file'),
                meta: doc.kind.toUpperCase(),
                external: true,
                icon: doc.kind === 'video' ? 'video' : 'file',
              }))}
            />
          </DetailSection>
        ) : null}

        {technologies.length > 0 ? (
          <DetailSection title={t('skills')}>
            <DetailTechList technologies={technologies} />
          </DetailSection>
        ) : null}

        {isEmpty ? <p className="py-10 text-muted-foreground">{t('empty')}</p> : null}
      </DetailSections>

      <DetailPager prev={prev} next={next} prevLabel={t('prev')} nextLabel={t('next')} label={t('more')} />
    </DetailArticle>
  );
}

/** Previous / next entries around `index` in a list, for the bottom navigation. */
export function neighbours<T>(
  list: T[],
  index: number,
  toItem: (item: T) => DetailNavItem,
): { prev: DetailNavItem | null; next: DetailNavItem | null } {
  return {
    prev: index > 0 ? toItem(list[index - 1]!) : null,
    next: index >= 0 && index < list.length - 1 ? toItem(list[index + 1]!) : null,
  };
}
