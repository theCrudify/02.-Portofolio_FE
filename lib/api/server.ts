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
  query?: Record<string, string | number | undefined>;
  cookieHeader?: string;
}

export function getDefaultSiteData(locale: SupportedLocale = 'en'): SiteData {
  const isId = locale === 'id';
  return {
    profile: {
      name: 'Jidan Fathilla',
      headline: isId
        ? 'Fullstack Software Engineer yang membangun sistem web & edge andal'
        : 'Fullstack Software Engineer building reliable web & edge systems',
      bio: isId
        ? 'Software engineer berpengalaman di bidang TypeScript, Next.js, Hono, dan arsitektur cloud terdistribusi.'
        : 'Experienced software engineer specializing in TypeScript, Next.js, Hono, and distributed cloud architectures.',
      avatar: null,
      location: 'Jakarta, Indonesia',
      timezone: 'Asia/Jakarta',
      email: 'contact@example.com',
      socials: {
        github: 'https://github.com/example',
        linkedin: 'https://linkedin.com/in/example',
      },
      availability: 'open_to_work',
      workPreference: 'remote',
      languages: [
        { name: 'Indonesian', level: 'native' },
        { name: 'English', level: 'professional' },
      ],
      interests: [
        { label: isId ? 'Komputasi Edge' : 'Edge Computing', icon: 'cpu' },
        { label: isId ? 'Sumber Terbuka' : 'Open Source', icon: 'code' },
      ],
      referencesNote: isId ? 'Tersedia berdasarkan permintaan' : 'Available upon request',
      careerStartDate: '2022-01-01',
      updatedAt: '2026-05-01T00:00:00.000Z',
    },
    settings: {
      themePreset: 'slate',
      colorMode: 'system',
      fontPair: 'geist',
      sectionOrder: [
        'hero',
        'about',
        'projects',
        'skills',
        'experience',
        'education',
        'certifications',
        'activities',
        'achievements',
        'publications',
        'testimonials',
        'github',
        'contact',
      ],
      hiddenSections: [],
      heroCvButtons: 'both',
      seo: {
        title: 'Jidan Fathilla · Fullstack Software Engineer',
        description: isId
          ? 'Portofolio pribadi, studi kasus, dan pengalaman rekayasa perangkat lunak.'
          : 'Personal portfolio, case studies, and software engineering experience.',
        ogImage: null,
      },
    },
    stats: {
      yearsExperience: 4,
      projectCount: 2,
      certificationCount: 1,
    },
    technologies: {
      frontend: [
        { name: 'TypeScript', slug: 'typescript', icon: 'typescript' },
        { name: 'React', slug: 'react', icon: 'react' },
        { name: 'Next.js', slug: 'nextjs', icon: 'nextdotjs' },
        { name: 'Tailwind CSS', slug: 'tailwindcss', icon: 'tailwindcss' },
      ],
      backend: [
        { name: 'Node.js', slug: 'nodejs', icon: 'nodedotjs' },
        { name: 'Hono', slug: 'hono', icon: 'hono' },
        { name: 'Go', slug: 'go', icon: 'go' },
      ],
      database: [
        { name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql' },
        { name: 'Drizzle', slug: 'drizzle', icon: 'drizzle' },
      ],
      devops: [
        { name: 'Cloudflare', slug: 'cloudflare', icon: 'cloudflare' },
        { name: 'Vercel', slug: 'vercel', icon: 'vercel' },
        { name: 'Docker', slug: 'docker', icon: 'docker' },
      ],
      tools: [
        { name: 'Git', slug: 'git', icon: 'git' },
        { name: 'Figma', slug: 'figma', icon: 'figma' },
      ],
      soft_skill: [],
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'Tech Nusantara',
        companyLogo: null,
        companyUrl: 'https://example.com',
        role: 'Senior Fullstack Engineer',
        employmentType: 'full_time',
        location: 'Jakarta, Indonesia',
        workMode: 'remote',
        startDate: '2023-03-01',
        endDate: null,
        description: isId
          ? 'Memimpin pengembangan platform web utama dan layanan API edge.'
          : 'Leading core web platform and edge API services.',
        achievements: [
          isId
            ? 'Menurunkan latensi API p95 sebesar 45% melalui caching edge dan optimasi query'
            : 'Reduced p95 API latency by 45% through edge caching and query optimization',
        ],
        technologies: [
          { name: 'TypeScript', slug: 'typescript', icon: 'typescript' },
          { name: 'Next.js', slug: 'nextjs', icon: 'nextdotjs' },
          { name: 'Hono', slug: 'hono', icon: 'hono' },
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Universitas Indonesia',
        logo: null,
        degree: 'B.Sc.',
        field: isId ? 'Ilmu Komputer' : 'Computer Science',
        startDate: '2018-08-01',
        endDate: '2022-07-01',
        gpa: '3.85',
        gpaScale: '4.00',
        description: isId
          ? 'Fokus pada rekayasa perangkat lunak dan sistem terdistribusi.'
          : 'Focused on software engineering and distributed systems.',
        activities: [
          isId
            ? 'Asisten Dosen Pemrograman Web & Basis Data'
            : 'Teaching Assistant for Web Programming & Databases',
        ],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        type: 'certification',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issuerLogo: null,
        issueDate: '2024-05-01',
        expiryDate: '2027-05-01',
        isExpired: false,
        credentialId: 'AWS-SAA-12345',
        credentialUrl: 'https://aws.amazon.com/verification',
        image: null,
        featured: true,
      },
    ],
    activities: [
      {
        id: 'act-1',
        type: 'organization',
        organization: 'Jakarta JS Community',
        eventName: null,
        role: isId ? 'Pembicara & Pengurus' : 'Speaker & Organizer',
        startDate: '2023-01-01',
        endDate: null,
        description: isId
          ? 'Menyelenggarakan pertemuan bulanan komunitas JavaScript & TypeScript.'
          : 'Organizing monthly JavaScript & TypeScript meetups.',
        achievements: [
          isId
            ? 'Menyelenggarakan 12+ lokakarya komunitas dengan 500+ peserta'
            : 'Hosted 12+ community workshops with 500+ attendees',
        ],
        media: null,
        linkUrl: 'https://example.com',
      },
    ],
    achievements: [],
    publications: [],
    testimonials: [],
    github: {
      publicRepos: 28,
      followers: 145,
      totalStars: 420,
      topLanguages: [
        { name: 'TypeScript', percent: 68 },
        { name: 'Go', percent: 18 },
        { name: 'Python', percent: 14 },
      ],
    },
    featuredProjects: [
      {
        slug: 'cashier-app',
        title: isId ? 'Aplikasi Kasir' : 'Cashier App',
        summary: isId
          ? 'Aplikasi POS untuk toko ritel dengan sinkronisasi offline dan inventaris real-time'
          : 'POS for small shops with offline sync and real-time inventory',
        type: 'freelance',
        projectState: 'live',
        featured: true,
        cover: null,
        clip: null,
        technologies: [
          { name: 'Next.js', slug: 'nextjs', icon: 'nextdotjs' },
          { name: 'TypeScript', slug: 'typescript', icon: 'typescript' },
          { name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql' },
        ],
        primaryLink: {
          type: 'demo',
          label: 'Live Demo',
          url: 'https://demo.example.com',
          isPrivate: false,
        },
        periodStart: '2025-01-01',
        periodEnd: '2025-04-30',
      },
      {
        slug: 'edge-analytics-engine',
        title: isId ? 'Mesin Analitik Edge' : 'Edge Analytics Engine',
        summary: isId
          ? 'Analitik web tanpa cookie yang ramah privasi di atas Cloudflare Workers'
          : 'Privacy-friendly cookieless web analytics running on Cloudflare Workers',
        type: 'open_source',
        projectState: 'live',
        featured: true,
        cover: null,
        clip: null,
        technologies: [
          { name: 'Hono', slug: 'hono', icon: 'hono' },
          { name: 'Cloudflare', slug: 'cloudflare', icon: 'cloudflare' },
          { name: 'Drizzle', slug: 'drizzle', icon: 'drizzle' },
        ],
        primaryLink: {
          type: 'repo',
          label: 'Private Repo',
          url: null,
          isPrivate: true,
        },
        periodStart: '2025-06-01',
        periodEnd: null,
      },
    ],
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
    return getDefaultSiteData(locale);
  }
}

export async function fetchProjectsList(options: {
  locale: SupportedLocale;
  technology?: string;
  type?: string;
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
        page: options.page,
        limit: options.limit,
      },
    });
    return {
      data: res.data,
      meta: res.meta ?? { page: 1, limit: 20, total: res.data.length },
    };
  } catch {
    const fallback = getDefaultSiteData(options.locale).featuredProjects.filter((p) => {
      if (options.type && p.type !== options.type) return false;
      if (options.technology && !p.technologies.some((t) => t.slug === options.technology)) {
        return false;
      }
      return true;
    });
    return {
      data: fallback,
      meta: { page: 1, limit: 20, total: fallback.length },
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
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    const fallbackCards = getDefaultSiteData(locale).featuredProjects;
    const card = fallbackCards.find((p) => p.slug === slug);
    if (!card) {
      return null;
    }
    const isId = locale === 'id';
    return {
      slug: card.slug,
      title: card.title,
      summary: card.summary,
      type: card.type,
      projectState: card.projectState,
      role: 'Fullstack Developer',
      teamSize: 2,
      client: 'Toko Maju',
      periodStart: card.periodStart,
      periodEnd: card.periodEnd,
      problem: isId
        ? 'Pembukuan manual menyebabkan selisih stok antar cabang.'
        : 'Manual bookkeeping caused frequent stock mismatches across branches.',
      solution: isId
        ? 'Membangun PWA offline-first dengan sinkronisasi latar belakang.'
        : 'Built an offline-first PWA with background sync and barcode scanning.',
      result: isId
        ? 'Memangkas waktu transaksi 60% dan menghilangkan selisih stok harian.'
        : 'Reduced checkout time by 60% and eliminated daily stock discrepancies.',
      challenges: isId
        ? 'Menyelesaikan konflik sinkronisasi data multi-kasir saat kembali online.'
        : 'Resolving multi-device sync conflicts when reconnecting after offline periods.',
      metrics: [
        { label: isId ? 'Waktu kasir' : 'Checkout time', value: '-60%' },
        { label: isId ? 'Transaksi harian' : 'Daily transactions', value: '1,200+' },
      ],
      highlights: [
        isId ? 'Sinkronisasi offline-first IndexedDB' : 'Offline-first IndexedDB sync',
        isId ? 'Kontrol akses berbasis peran' : 'Role-based access control',
      ],
      technologies: {
        frontend: card.technologies,
        backend: [],
        database: [],
        devops: [],
        other: [],
      },
      links: card.primaryLink ? [card.primaryLink] : [],
      cover: card.cover,
      architecture: null,
      media: [],
      seo: {
        title: card.title,
        description: card.summary,
      },
      updatedAt: '2026-05-01T10:00:00.000Z',
      prev: null,
      next: null,
    };
  }
}

export async function fetchCertificationsList(
  locale: SupportedLocale = 'en',
  type?: string,
): Promise<PublicCertification[]> {
  try {
    const res = await apiGet<PublicCertification[]>('/certifications', {
      locale,
      tags: ['certifications'],
      query: { type },
    });
    return res.data;
  } catch {
    const list = getDefaultSiteData(locale).certifications;
    return type ? list.filter((c) => c.type === type) : list;
  }
}
