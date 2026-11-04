import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { LookupIcon } from '@/components/ui/lookup-icon';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
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
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
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
  const siteUrl = getSiteUrl();

  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: t('title'), url: `${siteUrl}/projects` },
    { name: project.title, url: `${siteUrl}/projects/${project.slug}` },
  ]);

  return (
    <article className="py-12 md:py-20">
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

      <Container className="space-y-12">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{project.type.label}</Badge>
            <Badge variant="outline">{project.state.label}</Badge>
          </div>

          <h1 className="font-heading text-[32px] font-bold leading-tight tracking-tight text-foreground md:text-[48px]">
            {project.title}
          </h1>

          <p className="max-w-[65ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
            {project.summary}
          </p>

          <div className="grid grid-cols-2 gap-4 rounded-md border border-border bg-muted/40 p-4 text-sm sm:grid-cols-4">
            {project.role ? (
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">{t('role')}</p>
                <p className="mt-1 font-medium text-foreground">{project.role}</p>
              </div>
            ) : null}
            {project.teamSize ? (
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {t('teamSize')}
                </p>
                <p className="mt-1 font-medium text-foreground">{project.teamSize}</p>
              </div>
            ) : null}
            {project.client ? (
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">{t('client')}</p>
                <p className="mt-1 font-medium text-foreground">
                  {project.client.websiteUrl ? (
                    <a
                      href={project.client.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      {project.client.name}
                    </a>
                  ) : (
                    project.client.name
                  )}
                </p>
              </div>
            ) : null}
            {project.positions.length > 0 ? (
              <div className="col-span-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">{t('company')}</p>
                <ul className="mt-1 space-y-0.5">
                  {project.positions.map((pos) => (
                    <li key={pos.id} className="font-medium text-foreground">
                      {pos.organization?.name}
                      <span className="text-muted-foreground"> · {pos.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.periodStart ? (
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">{t('period')}</p>
                <p className="mt-1 font-mono text-xs text-foreground">
                  {formatPeriod(project.periodStart, project.periodEnd, typedLocale)}
                </p>
              </div>
            ) : null}
          </div>

          <ProjectLinks
            links={project.links}
            projectSlug={project.slug}
            privateLabel={t('privateRepo')}
          />
        </div>

        {project.cover ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={project.cover.url}
              alt={project.cover.alt || project.title}
              fill
              priority
              sizes="(max-width: 1120px) 100vw, 1120px"
              className="object-cover"
            />
          </div>
        ) : null}

        {demoVideo ? (
          <div className="space-y-3">
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

        <MetricBadgeGrid metrics={project.metrics} />

        {project.problem || project.solution || project.result ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {project.problem ? (
              <div className="space-y-2 rounded-md border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">{t('problem')}</h2>
                <p className="text-sm leading-[1.7] text-muted-foreground">{project.problem}</p>
              </div>
            ) : null}
            {project.solution ? (
              <div className="space-y-2 rounded-md border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">{t('solution')}</h2>
                <p className="text-sm leading-[1.7] text-muted-foreground">{project.solution}</p>
              </div>
            ) : null}
            {project.result ? (
              <div className="space-y-2 rounded-md border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">{t('result')}</h2>
                <p className="text-sm leading-[1.7] text-muted-foreground">{project.result}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {project.responsibilities.length > 0 ? (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {t('responsibilities')}
            </h2>
            <ul className="space-y-2.5">
              {project.responsibilities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-base leading-relaxed text-foreground">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {project.highlights.length > 0 ? (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">{t('highlights')}</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.highlights.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-md border border-border bg-card p-4 text-sm text-foreground"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">{t('techStack')}</h2>
          <TechStackGroup technologies={project.technologies} />
        </div>

        {project.architecture ? (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {t('architecture')}
            </h2>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={project.architecture.url}
                alt={project.architecture.alt || `${project.title} architecture`}
                fill
                sizes="(max-width: 1120px) 100vw, 1120px"
                className="object-contain"
              />
            </div>
          </div>
        ) : null}

        {documents.length > 0 ? (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">{t('documents')}</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-md border border-border bg-card p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <LookupIcon name={doc.role.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">
                        {doc.caption ?? doc.title ?? doc.alt ?? doc.role.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {doc.role.label} · {doc.kind.toUpperCase()}
                      </span>
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {galleryItems.length > 0 ? (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">{t('gallery')}</h2>
            <ProjectGallery items={galleryItems} />
          </div>
        ) : null}

        {project.challenges ? (
          <div className="space-y-3 rounded-md border border-border bg-muted/50 p-6">
            <h2 className="text-xl font-semibold text-foreground">{t('challenges')}</h2>
            <p className="max-w-[65ch] text-base leading-[1.7] text-muted-foreground">
              {project.challenges}
            </p>
          </div>
        ) : null}

        {project.prev || project.next ? (
          <nav
            aria-label="Project navigation"
            className="flex flex-col justify-between gap-4 border-t border-border pt-8 sm:flex-row"
          >
            {project.prev ? (
              <Link
                href={`/projects/${project.prev.slug}`}
                className={buttonVariants({ variant: 'outline' })}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>
                  {t('prevProject')}: {project.prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {project.next ? (
              <Link
                href={`/projects/${project.next.slug}`}
                className={buttonVariants({ variant: 'outline' })}
              >
                <span>
                  {t('nextProject')}: {project.next.title}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </Container>
    </article>
  );
}

