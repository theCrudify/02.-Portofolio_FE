import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import {
  DetailBulletList,
  DetailHeader,
  DetailNumberedList,
  DetailPager,
  DetailProse,
  DetailRowList,
  DetailSection,
  DetailStatPanel,
  DetailTechList,
  type DetailChip,
  type DetailFact,
  type DetailNavItem,
} from '@/components/detail/detail-layout';
import { MultiImageShowcase } from '@/components/media/multi-image-showcase';
import { ProjectCard } from '@/components/project/project-card';
import { ProjectLinks } from '@/components/project/project-links';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import type {
  PublicImage,
  PublicOrganization,
  PublicPortfolioExtras,
  PublicProjectCard,
  PublicProjectRef,
} from '@/lib/api/types';
import { cn } from '@/lib/utils';

export type { DetailChip, DetailFact, DetailNavItem };

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
  /** Kind labels shown in the pill above the title (type, rank). */
  badges?: (string | null | undefined)[];
  /** Mono line above the title (period, date). */
  kicker?: string | null;
  /** Status chips in the hero panel (active, expired…). */
  chips?: DetailChip[];
  backHref: string;
  backLabel: string;
  /** Used as the analytics target id for link clicks. */
  trackId: string;
  cover?: PublicImage | null;
  /** Certificates and scans are shown whole instead of cropped. */
  coverFit?: 'cover' | 'contain';
  /** Stat tiles in the hero panel; the first one is accented. Empty values are skipped. */
  facts?: DetailFact[];
  organization?: PublicOrganization | null;
  description?: string | null;
  /** Work experience only: job description bullets, shown before achievements. */
  responsibilities?: string[];
  responsibilitiesTitle?: string;
  achievementsTitle?: string;
  /** Work experience only: projects delivered in this role. */
  projects?: PublicProjectRef[];
  /** Full cards for those projects (cover, stack); falls back to plain links when missing. */
  projectCards?: PublicProjectCard[];
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
  kicker,
  chips = [],
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
  projectCards = [],
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
  const headerActions =
    actions || links.length ? (
      <>
        {actions}
        <ProjectLinks links={links} projectSlug={trackId} privateLabel={t('private')} />
      </>
    ) : null;

  // Each block becomes a full-width Section; backgrounds alternate like the home page.
  const blocks: { key: string; title: string; body: ReactNode }[] = [];
  if (description) {
    blocks.push({ key: 'description', title: t('description'), body: <DetailProse>{description}</DetailProse> });
  }
  if (responsibilities.length) {
    blocks.push({
      key: 'responsibilities',
      title: responsibilitiesTitle ?? t('responsibilities'),
      body: <DetailBulletList items={responsibilities} />,
    });
  }
  if (achievements.length) {
    blocks.push({
      key: 'achievements',
      title: achievementsTitle ?? t('achievements'),
      body: <DetailNumberedList items={achievements} />,
    });
  }
  if (projects.length) {
    blocks.push({
      key: 'projects',
      title: projectsTitle ?? t('projects'),
      body:
        projectCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projectCards.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        ) : (
          <DetailRowList rows={projects.map((p) => ({ key: p.slug, href: `/projects/${p.slug}`, title: p.title }))} />
        ),
    });
  }
  if (images.length) {
    blocks.push({
      key: 'gallery',
      title: t('gallery'),
      body: (
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
      ),
    });
  }
  if (documents.length) {
    blocks.push({
      key: 'documents',
      title: t('documents'),
      body: (
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
      ),
    });
  }
  if (technologies.length) {
    blocks.push({ key: 'skills', title: t('skills'), body: <DetailTechList technologies={technologies} /> });
  }

  return (
    <article>
      <DetailHeader
        backHref={backHref}
        backLabel={backLabel}
        eyebrow={badges}
        kicker={kicker}
        title={title}
        organization={organization}
        byline={subtitle}
        actions={headerActions}
        aside={
          <DetailStatPanel image={cover} imageFit={coverFit} imageAlt={title} chips={chips} facts={facts} />
        }
      />

      {blocks.map((b, i) => (
        <DetailSection key={b.key} title={b.title} muted={i % 2 === 0}>
          {b.body}
        </DetailSection>
      ))}
      {blocks.length === 0 ? (
        <DetailSection title={t('description')} muted>
          <p className="text-muted-foreground">{t('empty')}</p>
        </DetailSection>
      ) : null}

      <DetailPager prev={prev} next={next} prevLabel={t('prev')} nextLabel={t('next')} label={t('more')} />
    </article>
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
