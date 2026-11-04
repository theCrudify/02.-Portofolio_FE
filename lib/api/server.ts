import { FrontendQueryBuilder, type SortOrder } from '@/core/query';
import { ApiError, type ApiListResponse } from '@/lib/api/client';
import type {
  PublicCertification,
  PublicProjectCard,
  PublicProjectDetail,
  SiteData,
  SupportedLocale,
} from '@/lib/api/types';

export interface ServerFetchOptions {
  locale?: SupportedLocale;
  tags?: string[];
  revalidate?: number | false;
  query?: Record<string, string | number | boolean | undefined>;
  cookieHeader?: string;
}

export function getDefaultSiteData(): SiteData {
  return {
    profile: null,
    settings: {
      themePreset: 'slate',
      colorMode: 'system',
      fontPair: 'geist',
      // Section order lives in the database; without the API nothing is rendered.
      sections: [],
      heroCvButtons: 'both',
      seo: {
        title: null,
        description: null,
        ogImage: null,
      },
    },
    stats: {
      yearsExperience: 0,
      projectCount: 0,
      certificationCount: 0,
    },
    technologies: [],
    experiences: [],
    education: [],
    certifications: [],
    activities: [],
    achievements: [],
    publications: [],
    testimonials: [],
    github: null,
    featuredProjects: [],
    exportPresets: [],
    filters: { projectTypes: [], certificationTypes: [], activityTypes: [] },
  };
}

export async function apiGet<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ApiListResponse<T>> {
  const apiOrigin = process.env.API_ORIGIN || 'http://localhost:8787';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`/v1${normalizedPath}`, apiOrigin);

  if (options.locale) {
    url.searchParams.set('locale', options.locale);
  }
  if (options.query) {
    FrontendQueryBuilder.assertFlatQuery(options.query);
    for (const [k, v] of Object.entries(options.query)) {
      if (v !== undefined && v !== '') {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (options.cookieHeader) {
    headers.Cookie = options.cookieHeader;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: {
      ...(options.tags ? { tags: options.tags } : {}),
      ...(options.revalidate !== undefined ? { revalidate: options.revalidate } : {}),
    },
  });

  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    const errObj =
      payload && typeof payload === 'object' && 'error' in payload
        ? (payload as { error?: { code?: string; message?: string } }).error
        : undefined;
    throw new ApiError(
      res.status,
      errObj?.code ?? 'INTERNAL_ERROR',
      errObj?.message ?? `Server API error (${res.status})`,
    );
  }

  return (await res.json()) as ApiListResponse<T>;
}

export async function fetchSiteData(locale: SupportedLocale = 'en'): Promise<SiteData> {
  try {
    const res = await apiGet<SiteData>('/site', {
      locale,
      tags: ['site'],
    });
    return res.data;
  } catch {
    return getDefaultSiteData();
  }
}

export async function fetchProjectsList(options: {
  locale: SupportedLocale;
  technology?: string;
  type?: string;
  search?: string;
  q?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  sort?: string;
  featured?: boolean;
  all?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ data: PublicProjectCard[]; meta: { page: number; limit: number; total: number } }> {
  try {
    const res = await apiGet<PublicProjectCard[]>('/projects', {
      locale: options.locale,
      tags: ['projects'],
      query: {
        technology: options.technology,
        type: options.type,
        search: options.search ?? options.q,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder,
        sort: options.sort,
        featured: options.featured,
        all: options.all,
        page: options.page,
        limit: options.limit,
      },
    });
    return {
      data: res.data,
      meta: res.meta ?? { page: 1, limit: 20, total: res.data.length },
    };
  } catch {
    return {
      data: [],
      meta: { page: options.page ?? 1, limit: options.limit ?? 20, total: 0 },
    };
  }
}

export async function fetchProjectDetail(
  slug: string,
  locale: SupportedLocale = 'en',
): Promise<PublicProjectDetail | null> {
  try {
    const res = await apiGet<PublicProjectDetail>(`/projects/${encodeURIComponent(slug)}`, {
      locale,
      tags: ['projects', `project:${slug}`],
    });
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchCertificationsList(
  locale: SupportedLocale = 'en',
  type?: string,
  search?: string,
  sortBy?: string,
  sortOrder?: SortOrder,
): Promise<PublicCertification[]> {
  try {
    const res = await apiGet<PublicCertification[]>('/certifications', {
      locale,
      tags: ['certifications'],
      query: { type, search, sortBy, sortOrder },
    });
    return res.data;
  } catch {
    return [];
  }
}
