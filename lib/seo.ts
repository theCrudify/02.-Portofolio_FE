import type { Metadata } from 'next';
import type { SupportedLocale } from '@/lib/api/types';

export interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  locale: SupportedLocale;
  image?: string | null;
  noIndex?: boolean;
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const cleanPath = input.path.startsWith('/') ? input.path : `/${input.path}`;
  const enPath = cleanPath === '/' ? '' : cleanPath;
  const idPath = cleanPath === '/' ? '/id' : `/id${cleanPath}`;

  const canonicalUrl =
    input.locale === 'id' ? `${siteUrl}${idPath}` : `${siteUrl}${enPath || '/'}`;

  const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: input.title,
    description: input.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}${enPath || '/'}`,
        id: `${siteUrl}${idPath}`,
        'x-default': `${siteUrl}${enPath || '/'}`,
      },
    },
    openGraph: {
      type: 'website',
      title: input.title,
      description: input.description,
      url: canonicalUrl,
      locale: input.locale === 'id' ? 'id_ID' : 'en_US',
      ...(input.image ? { images: [{ url: input.image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      ...(input.image ? { images: [input.image] } : {}),
    },
  };

  if (input.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}
