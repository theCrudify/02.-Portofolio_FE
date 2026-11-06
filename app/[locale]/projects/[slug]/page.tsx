import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CircleAlert, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import {
  DetailBrowserFrame,
  DetailBulletList,
  DetailHeader,
  DetailNumberedList,
  DetailPager,
  DetailProse,
  DetailRowList,
  DetailSection,
  DetailStatPanel,
} from '@/components/detail/detail-layout';
import { getEmbedIframeUrl, VideoEmbed } from '@/components/media/video-embed';
import { MetricBadgeGrid } from '@/components/project/metric-badge';
import { ProjectGallery } from '@/components/project/project-gallery';
import { ProjectLinks } from '@/components/project/project-links';
import { TechStackGroup } from '@/components/project/tech-stack-group';
import {
  buildBreadcrumbJsonLd,
  buildProjectCreativeWorkJsonLd,
  buildVideoObjectJsonLd,
  JsonLdScript,
} from '@/components/seo/json-ld';
import { fetchProjectDetail, fetchProjectsList, fetchSiteData } from '@/lib/api/server';
import type { SupportedLocale } from '@/lib/api/types';
import { formatPeriod } from '@/lib/format';
import { buildMetadata, getSiteUrl } from '@/lib/seo';

export async function generateStaticParams() {
  const [enList, idList] = await Promise.all([
    fetchProjectsList({ locale: 'en' }),
    fetchProjectsList({ locale: 'id' }),
  ]);

  const params: { locale: string; slug: string }[] = [];
  for (const p of enList.data) {
    params.push({ locale: 'en', slug: p.slug });
  }
  for (const p of idList.data) {
    params.push({ locale: 'id', slug: p.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';
  const project = await fetchProjectDetail(slug, typedLocale);

  if (!project) {
    return buildMetadata({
      title: 'Project Not Found',
      description: '',
      path: `/projects/${slug}`,
      locale: typedLocale,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: project.seo.title || project.title,
    description: project.seo.description || project.summary,
    path: `/projects/${project.slug}`,
    locale: typedLocale,
    image: project.cover?.url,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  // Without this next-intl reads the locale from headers, which breaks on-demand static rendering.
  setRequestLocale(locale);
  const typedLocale: SupportedLocale = locale === 'id' ? 'id' : 'en';

  const [t, site, project] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: 'sections.projects' }),
    fetchSiteData(typedLocale),
    fetchProjectDetail(slug, typedLocale),
  ]);

  if (!project) {
    notFound();
  }

  const demoVideo = project.media.find((m) => m.role.code === 'demo_video') ?? null;
  const galleryItems = project.media.filter((m) => m.role.code === 'gallery');
  // PDFs, slide decks and other documents attached to the project.
  const documents = project.media.filter(
    (m) => m.kind === 'pdf' || m.kind === 'document' || ['documentation', 'slides'].includes(m.role.code),
  );
  const techGroups = project.technologies.filter((g) => g.items.length > 0);
  const siteUrl = getSiteUrl();

  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: t('title'), url: `${siteUrl}/projects` },
    { name: project.title, url: `${siteUrl}/projects/${project.slug}` },
  ]);

  // Each block becomes a full-width Section; backgrounds alternate like the home page.
  const blocks: { key: string; title: string; body: ReactNode }[] = [];
  if (demoVideo) {
    blocks.push({
      key: 'demo',
      title: demoVideo.title ?? project.title,
      body: (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <VideoEmbed
            provider={demoVideo.provider}
            embedId={demoVideo.embedId}
            url={demoVideo.url}
            thumbnailUrl={demoVideo.thumbnailUrl}
            title={demoVideo.title ?? project.title}
            projectSlug={project.slug}
          />
        </div>
      ),
    });
  }
  if (project.problem || project.solution) {
    blocks.push({
      key: 'problem-solution',
      title: [project.problem && t('problem'), project.solution && t('solution')].filter(Boolean).join(' & '),
      body: (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {project.problem ? (
            <div className="rounded-2xl border border-destructive/25 bg-card p-6 shadow-xs md:p-8">
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-destructive">
                <CircleAlert className="h-4 w-4" />
                {t('problem')}
              </p>
              <DetailProse>{project.problem}</DetailProse>
            </div>
          ) : null}
          {project.solution ? (
            <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-xs md:p-8">
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <Lightbulb className="h-4 w-4" />
                {t('solution')}
              </p>
              <DetailProse>{project.solution}</DetailProse>
            </div>
          ) : null}
        </div>
      ),
    });
  }
  if (project.result || project.metrics.length > 0) {
    blocks.push({
      key: 'result',
      title: t('result'),
      body: (
        <div className="space-y-8">
          <MetricBadgeGrid metrics={project.metrics} />
          {project.result ? <DetailProse>{project.result}</DetailProse> : null}
        </div>
      ),
    });
  }
  if (project.responsibilities.length > 0) {
    blocks.push({
      key: 'responsibilities',
      title: t('responsibilities'),
      body: <DetailBulletList items={project.responsibilities} />,
    });
  }
  if (project.highlights.length > 0) {
    blocks.push({
      key: 'highlights',
      title: t('highlights'),
      body: <DetailNumberedList items={project.highlights} />,
    });
  }
  if (project.challenges) {
    blocks.push({
      key: 'challenges',
      title: t('challenges'),
      body: <DetailProse>{project.challenges}</DetailProse>,
    });
  }
  if (project.architecture) {
    const arch = project.architecture;
    blocks.push({
      key: 'architecture',
      title: t('architecture'),
      body: (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Image
            src={arch.url}
            alt={arch.alt || `${project.title} architecture`}
            fill
            sizes="(max-width: 1580px) 100vw, 1440px"
            className="object-contain p-6"
          />
        </div>
      ),
    });
  }
  if (galleryItems.length > 0) {
    blocks.push({ key: 'gallery', title: t('gallery'), body: <ProjectGallery items={galleryItems} /> });
  }
  if (techGroups.length > 0) {
    blocks.push({ key: 'tech', title: t('techStack'), body: <TechStackGroup technologies={techGroups} /> });
  }
  if (project.positions.length > 0) {
    blocks.push({
      key: 'positions',
      title: t('company'),
      body: (
        <DetailRowList
          rows={project.positions.map((pos) => ({
            key: pos.id,
            href: `/experience/${pos.id}`,
            title: pos.role,
            meta: [pos.organization?.name, formatPeriod(pos.startDate, pos.endDate, typedLocale)]
              .filter(Boolean)
              .join(' · '),
          }))}
        />
      ),
    });
  }
  if (documents.length > 0) {
    blocks.push({
      key: 'documents',
      title: t('documents'),
      body: (
        <DetailRowList
          rows={documents.map((doc) => ({
            key: doc.id,
            href: doc.url,
            title: doc.caption ?? doc.title ?? doc.alt ?? doc.role.label,
            meta: `${doc.role.label} · ${doc.kind.toUpperCase()}`,
            external: true,
            icon: doc.kind === 'video' ? 'video' : 'file',
          }))}
        />
      ),
    });
  }

  return (
    <article>
      <JsonLdScript data={buildProjectCreativeWorkJsonLd(project, site.profile?.name ?? 'Portfolio')} />
      <JsonLdScript data={breadcrumbData} />
      {demoVideo ? (
        <JsonLdScript
          data={buildVideoObjectJsonLd({
            name: demoVideo.title || project.title,
            description: project.summary,
            thumbnailUrl: demoVideo.thumbnailUrl ?? project.cover?.url,
            uploadDate: project.updatedAt,
            embedUrl: getEmbedIframeUrl(demoVideo.provider, demoVideo.embedId, demoVideo.url),
          })}
        />
      ) : null}

      <DetailHeader
        backHref="/projects"
        backLabel={t('title')}
        eyebrow={[project.type.label, project.state.label]}
        kicker={
          project.periodStart ? formatPeriod(project.periodStart, project.periodEnd, typedLocale) : null
        }
        title={project.title}
        lede={project.summary}
        organization={project.client}
        actions={
          project.links.length > 0 ? (
            <ProjectLinks links={project.links} projectSlug={project.slug} privateLabel={t('privateRepo')} />
          ) : null
        }
        aside={
          <div className="space-y-3">
            <DetailBrowserFrame path={`/${project.slug}`} image={project.cover} title={project.title} />
            <DetailStatPanel
              imageAlt={project.title}
              facts={[
                { label: t('role'), value: project.role },
                { label: t('teamSize'), value: project.teamSize },
              ]}
            />
          </div>
        }
      />

      {blocks.map((b, i) => (
        <DetailSection key={b.key} title={b.title} muted={i % 2 === 0}>
          {b.body}
        </DetailSection>
      ))}

      <DetailPager
        prev={project.prev ? { href: `/projects/${project.prev.slug}`, title: project.prev.title } : null}
        next={project.next ? { href: `/projects/${project.next.slug}`, title: project.next.title } : null}
        prevLabel={t('prevProject')}
        nextLabel={t('nextProject')}
        label={t('title')}
      />
    </article>
  );
}
