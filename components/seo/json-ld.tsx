import type { PublicProfile, PublicProjectDetail } from '@/lib/api/types';
import { getSiteUrl } from '@/lib/seo';

export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function buildPersonJsonLd(profile: PublicProfile | null) {
  const siteUrl = getSiteUrl();
  if (!profile) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Portfolio',
      url: siteUrl,
    };
  }

  const sameAs = Object.values(profile.socials ?? {}).filter(
    (v): v is string => typeof v === 'string' && v.startsWith('http'),
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    url: siteUrl,
    ...(profile.avatar ? { image: profile.avatar.url } : {}),
    ...(profile.email ? { email: profile.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(profile.languages?.length
      ? { knowsLanguage: profile.languages.map((l) => l.name) }
      : {}),
    ...(profile.location
      ? {
          address: {
            '@type': 'PostalAddress',
            addressLocality: profile.location,
          },
        }
      : {}),
  };
}

export function buildWebSiteJsonLd(name: string, description: string) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url: siteUrl,
  };
}

export function buildProjectCreativeWorkJsonLd(
  project: PublicProjectDetail,
  authorName: string,
) {
  const siteUrl = getSiteUrl();
  const keywords = [
    ...project.technologies.frontend,
    ...project.technologies.backend,
    ...project.technologies.database,
    ...project.technologies.devops,
    ...project.technologies.other,
  ].map((t) => t.name);

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    ...(project.periodStart ? { dateCreated: project.periodStart } : {}),
    dateModified: project.updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    ...(keywords.length > 0 ? { keywords: keywords.join(', ') } : {}),
    ...(project.cover ? { image: project.cover.url } : {}),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildVideoObjectJsonLd(input: {
  name: string;
  description: string;
  thumbnailUrl?: string | null;
  uploadDate: string;
  embedUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: input.name,
    description: input.description,
    thumbnailUrl: input.thumbnailUrl ? [input.thumbnailUrl] : [],
    uploadDate: input.uploadDate,
    embedUrl: input.embedUrl,
  };
}

