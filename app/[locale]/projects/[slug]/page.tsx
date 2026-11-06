import type { Metadata } from "next";
import {
  Building2,
  CircleAlert,
  FileText,
  Images,
  Layers,
  Lightbulb,
  ListChecks,
  Mountain,
  Network,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  DetailArticle,
  DetailBulletList,
  DetailBrowserFrame,
  DetailFacts,
  DetailHeader,
  DetailNumberedList,
  DetailPager,
  DetailProse,
  DetailRowList,
  DetailSection,
  DetailSections,
} from "@/components/detail/detail-layout";
import { getEmbedIframeUrl, VideoEmbed } from "@/components/media/video-embed";
import { MetricBadgeGrid } from "@/components/project/metric-badge";
import { ProjectGallery } from "@/components/project/project-gallery";
import { ProjectLinks } from "@/components/project/project-links";
import { TechStackGroup } from "@/components/project/tech-stack-group";
import {
  buildBreadcrumbJsonLd,
  buildProjectCreativeWorkJsonLd,
  buildVideoObjectJsonLd,
  JsonLdScript,
} from "@/components/seo/json-ld";
import {
  fetchProjectDetail,
  fetchProjectsList,
  fetchSiteData,
} from "@/lib/api/server";
import type { SupportedLocale } from "@/lib/api/types";
import { formatPeriod } from "@/lib/format";
import { buildMetadata, getSiteUrl } from "@/lib/seo";

export async function generateStaticParams() {
  const [enList, idList] = await Promise.all([
    fetchProjectsList({ locale: "en" }),
    fetchProjectsList({ locale: "id" }),
  ]);

  const params: { locale: string; slug: string }[] = [];
  for (const p of enList.data) {
    params.push({ locale: "en", slug: p.slug });
  }
  for (const p of idList.data) {
    params.push({ locale: "id", slug: p.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale: SupportedLocale = locale === "id" ? "id" : "en";
  const project = await fetchProjectDetail(slug, typedLocale);

  if (!project) {
    return buildMetadata({
      title: "Project Not Found",
      description: "",
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
  const typedLocale: SupportedLocale = locale === "id" ? "id" : "en";

  const [t, site, project] = await Promise.all([
    getTranslations({ locale: typedLocale, namespace: "sections.projects" }),
    fetchSiteData(typedLocale),
    fetchProjectDetail(slug, typedLocale),
  ]);

  if (!project) {
    notFound();
  }

  const demoVideo =
    project.media.find((m) => m.role.code === "demo_video") ?? null;
  const galleryItems = project.media.filter((m) => m.role.code === "gallery");
  // PDFs, slide decks and other documents attached to the project.
  const documents = project.media.filter(
    (m) =>
      m.kind === "pdf" ||
      m.kind === "document" ||
      ["documentation", "slides"].includes(m.role.code),
  );
  const techGroups = project.technologies.filter((g) => g.items.length > 0);
  const siteUrl = getSiteUrl();

  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: t("title"), url: `${siteUrl}/projects` },
    { name: project.title, url: `${siteUrl}/projects/${project.slug}` },
  ]);

  return (
    <DetailArticle>
      <JsonLdScript
        data={buildProjectCreativeWorkJsonLd(
          project,
          site.profile?.name ?? "Portfolio",
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
        backLabel={t("title")}
        eyebrow={[project.type.label, project.state.label]}
        kicker={
          project.periodStart
            ? formatPeriod(project.periodStart, project.periodEnd, typedLocale)
            : null
        }
        title={project.title}
        lede={project.summary}
        organization={project.client}
        actions={
          project.links.length > 0 ? (
            <ProjectLinks
              links={project.links}
              projectSlug={project.slug}
              privateLabel={t("privateRepo")}
            />
          ) : null
        }
        aside={
          <div className="space-y-4">
            <DetailBrowserFrame
              path={`/${project.slug}`}
              image={project.cover}
              title={project.title}
            />
            <DetailFacts
              className="bg-card"
              facts={[
                { label: t("role"), value: project.role },
                { label: t("teamSize"), value: project.teamSize },
              ]}
            />
          </div>
        }
      />

      <DetailSections
        aside={
          <>
            {techGroups.length > 0 ? (
              <DetailSection title={t("techStack")} icon={Layers}>
                <TechStackGroup technologies={techGroups} />
              </DetailSection>
            ) : null}
            {project.positions.length > 0 ? (
              <DetailSection title={t("company")} icon={Building2}>
                <DetailRowList
                  columns={1}
                  rows={project.positions.map((pos) => ({
                    key: pos.id,
                    href: `/experience/${pos.id}`,
                    title: pos.role,
                    meta: [
                      pos.organization?.name,
                      formatPeriod(pos.startDate, pos.endDate, typedLocale),
                    ]
                      .filter(Boolean)
                      .join(" · "),
                  }))}
                />
              </DetailSection>
            ) : null}
            {documents.length > 0 ? (
              <DetailSection title={t("documents")} icon={FileText}>
                <DetailRowList
                  columns={1}
                  rows={documents.map((doc) => ({
                    key: doc.id,
                    href: doc.url,
                    title:
                      doc.caption ?? doc.title ?? doc.alt ?? doc.role.label,
                    meta: `${doc.role.label} · ${doc.kind.toUpperCase()}`,
                    external: true,
                    icon: doc.kind === "video" ? "video" : "file",
                  }))}
                />
              </DetailSection>
            ) : null}
          </>
        }
      >
        {demoVideo ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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

        {project.problem || project.solution ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {project.problem ? (
              <DetailSection title={t("problem")} icon={CircleAlert}>
                <DetailProse>{project.problem}</DetailProse>
              </DetailSection>
            ) : null}
            {project.solution ? (
              <DetailSection title={t("solution")} icon={Lightbulb}>
                <DetailProse>{project.solution}</DetailProse>
              </DetailSection>
            ) : null}
          </div>
        ) : null}

        {project.result || project.metrics.length > 0 ? (
          <DetailSection title={t("result")} icon={TrendingUp}>
            <div className="space-y-6">
              {project.result ? (
                <DetailProse>{project.result}</DetailProse>
              ) : null}
              <MetricBadgeGrid metrics={project.metrics} />
            </div>
          </DetailSection>
        ) : null}

        {project.responsibilities.length > 0 ? (
          <DetailSection title={t("responsibilities")} icon={ListChecks}>
            <DetailBulletList items={project.responsibilities} />
          </DetailSection>
        ) : null}

        {project.highlights.length > 0 ? (
          <DetailSection title={t("highlights")} icon={Sparkles}>
            <DetailNumberedList items={project.highlights} />
          </DetailSection>
        ) : null}

        {project.challenges ? (
          <DetailSection title={t("challenges")} icon={Mountain}>
            <DetailProse>{project.challenges}</DetailProse>
          </DetailSection>
        ) : null}

        {project.architecture ? (
          <DetailSection title={t("architecture")} icon={Network}>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={project.architecture.url}
                alt={
                  project.architecture.alt || `${project.title} architecture`
                }
                fill
                sizes="(max-width: 1180px) 100vw, 880px"
                className="object-contain p-4"
              />
            </div>
          </DetailSection>
        ) : null}

        {galleryItems.length > 0 ? (
          <DetailSection title={t("gallery")} icon={Images}>
            <ProjectGallery items={galleryItems} />
          </DetailSection>
        ) : null}
      </DetailSections>

      <DetailPager
        prev={
          project.prev
            ? {
                href: `/projects/${project.prev.slug}`,
                title: project.prev.title,
              }
            : null
        }
        next={
          project.next
            ? {
                href: `/projects/${project.next.slug}`,
                title: project.next.title,
              }
            : null
        }
        prevLabel={t("prevProject")}
        nextLabel={t("nextProject")}
        label={t("title")}
      />
    </DetailArticle>
  );
}
