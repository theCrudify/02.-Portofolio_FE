import type { MetadataRoute } from 'next';
import { fetchProjectsList, fetchSiteData } from '@/lib/api/server';
import { getSiteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [site, projectsResult] = await Promise.all([
    fetchSiteData('en'),
    fetchProjectsList({ locale: 'en', limit: 100 }),
  ]);

  const lastUpdated = site.profile?.updatedAt
    ? new Date(site.profile.updatedAt)
    : new Date();

  const staticPaths = ['', '/projects', '/certifications', '/privacy', '/cv'];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => {
    const enUrl = `${siteUrl}${p || '/'}`;
    const idUrl = `${siteUrl}/id${p}`;
    return {
      url: enUrl,
      lastModified: lastUpdated,
      alternates: {
        languages: {
          en: enUrl,
          id: idUrl,
        },
      },
    };
  });

  const projectEntries: MetadataRoute.Sitemap = projectsResult.data.map((proj) => {
    const enUrl = `${siteUrl}/projects/${proj.slug}`;
    const idUrl = `${siteUrl}/id/projects/${proj.slug}`;
    return {
      url: enUrl,
      lastModified: lastUpdated,
      alternates: {
        languages: {
          en: enUrl,
          id: idUrl,
        },
      },
    };
  });

  return [...staticEntries, ...projectEntries];
}

