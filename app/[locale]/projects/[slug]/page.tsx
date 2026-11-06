import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
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
} from '@/components/detail/detail-layout';
import { getEmbedIframeUrl, VideoEmbed } from '@/components/media/video-embed';
import { ProjectGallery } from '@/components/project/project-gallery';
import { ProjectLinks } from '@/components/project/project-links';
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

  return (
    <DetailArticle>
      <JsonLdScript
        data={buildProjectCreativeWorkJsonLd(
          project,
          site.profile?.name ?? 'Portfolio',
        )}
      />
      <JsonLdScript data={breadcrumbData} />
      {demoVideo ? (
        <JsonLdScript
          data={buildVideoObjectJsonLd({
            name: demoVideo.title || project.title,
            description: project.summary,
            thumbnailUrl: demoVideo.thumbnailUrl ?? project.cover?.url,
            uploadDate: project.updatedAt,
            embedUrl: getEmbedIframeUrl(
              demoVideo.provider,
              demoVideo.embedId,
              demoVideo.url,
            ),
          })}
        />
      ) : null}

      <DetailHeader
        backHref="/projects"
        backLabel={t('title')}
        eyebrow={[project.type.label, project.state.label]}
        title={project.title}
        lede={project.summary}
        organization={project.client}
        actions={
          project.links.length > 0 ? (
            <ProjectLinks links={project.links} projectSlug={project.slug} privateLabel={t('privateRepo')} />
          ) : null
        }
      />

      <DetailFacts
        facts={[
          { label: t('role'), value: project.role },
          { label: t('teamSize'), value: project.teamSize },
          {
            label: t('period'),
            value: project.periodStart ? formatPeriod(project.periodStart, project.periodEnd, typedLocale) : null,
          },
        ]}
      />

      {project.cover ? <DetailFigure image={project.cover} alt={project.title} /> : null}

      {demoVideo ? (
        <div className="mt-10 md:mt-14">
          <VideoEmbed
            provider={demoVideo.provider}
            embedId={demoVideo.embedId}
            url={demoVideo.url}
            thumbnailUrl={demoVideo.thumbnailUrl}
            title={demoVideo.title ?? project.title}
            projectSlug={project.slug}
          />
        </div>
      ) : null}

      <DetailSections>
        {project.problem ? (
          <DetailSection title={t('problem')}>
            <DetailProse>{project.problem}</DetailProse>
          </DetailSection>
        ) : null}

        {project.solution ? (
          <DetailSection title={t('solution')}>
            <DetailProse>{project.solution}</DetailProse>
          </DetailSection>
        ) : null}

        {project.result || project.metrics.length > 0 ? (
          <DetailSection title={t('result')}>
            {project.result ? <DetailProse>{project.result}</DetailProse> : null}
            {project.metrics.length > 0 ? (
              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 first:mt-0 sm:grid-cols-3">
                {project.metrics.map((metric, idx) => (
                  <div key={`${metric.label}-${idx}`} className="border-l-2 border-primary pl-4">
                    <dd className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                      {metric.value}
                    </dd>
                    <dt className="mt-1 text-sm text-muted-foreground">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </DetailSection>
        ) : null}

        {project.responsibilities.length > 0 ? (
          <DetailSection title={t('responsibilities')}>
            <DetailBulletList items={project.responsibilities} />
          </DetailSection>
        ) : null}

        {project.highlights.length > 0 ? (
          <DetailSection title={t('highlights')}>
            <DetailNumberedList items={project.highlights} />
          </DetailSection>
        ) : null}

        {project.challenges ? (
          <DetailSection title={t('challenges')}>
            <DetailProse>{project.challenges}</DetailProse>
          </DetailSection>
        ) : null}

        {project.architecture ? (
          <DetailSection title={t('architecture')}>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={project.architecture.url}
                alt={project.architecture.alt || `${project.title} architecture`}
                fill
                sizes="(max-width: 1180px) 100vw, 880px"
                className="object-contain p-4"
              />
            </div>
          </DetailSection>
        ) : null}

        {techGroups.length > 0 ? (
          <DetailSection title={t('techStack')}>
            <div className="space-y-6">
              {techGroups.map(({ group, items }) => (
                <div key={group.code} className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_minmax(0,1fr)]">
                  <p className="text-sm text-muted-foreground">{group.label}</p>
                  <DetailTechList technologies={items} />
                </div>
              ))}
            </div>
          </DetailSection>
        ) : null}

        {project.positions.length > 0 ? (
          <DetailSection title={t('company')}>
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
          </DetailSection>
        ) : null}

        {galleryItems.length > 0 ? (
          <DetailSection title={t('gallery')}>
            <ProjectGallery items={galleryItems} />
          </DetailSection>
        ) : null}

        {documents.length > 0 ? (
          <DetailSection title={t('documents')}>
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
          </DetailSection>
        ) : null}
      </DetailSections>

      <DetailPager
        prev={project.prev ? { href: `/projects/${project.prev.slug}`, title: project.prev.title } : null}
        next={project.next ? { href: `/projects/${project.next.slug}`, title: project.next.title } : null}
        prevLabel={t('prevProject')}
        nextLabel={t('nextProject')}
        label={t('title')}
      />
    </DetailArticle>
  );
}

