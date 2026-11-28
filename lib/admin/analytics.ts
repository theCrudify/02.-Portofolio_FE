import type { BreakdownItem } from '@/components/admin/breakdown-list';
import type { DailySeriesPoint } from '@/components/admin/views-chart';

export type AnalyticsRange = '7d' | '30d' | '90d';

export interface AnalyticsTotals {
  views: number;
  visitors: number;
  cvDownloads: number;
  linkClicks: number;
  shareOpens: number;
  videoPlays: number;
  messages: number;
}

/** GET /v1/admin/analytics payload. */
export interface AnalyticsPayload {
  range: AnalyticsRange;
  since: string;
  totals: AnalyticsTotals;
  previous: AnalyticsTotals | null;
  series: DailySeriesPoint[];
  topPaths: { path: string; count: number }[];
  topProjects: BreakdownItem[];
  referrers: BreakdownItem[];
  countries: BreakdownItem[];
  devices: BreakdownItem[];
  locales: BreakdownItem[];
  campaigns: BreakdownItem[];
  clicks: BreakdownItem[];
  eventTypes: BreakdownItem[];
}

export const RANGE_DAYS: Record<AnalyticsRange, number> = { '7d': 7, '30d': 30, '90d': 90 };

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export function countryName(code: string) {
  if (!/^[A-Z]{2}$/.test(code)) return 'Unknown';
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

const LABELS: Record<string, string> = {
  en: 'English',
  id: 'Indonesian',
  mobile: 'Mobile',
  desktop: 'Desktop',
  tablet: 'Tablet',
  unknown: 'Unknown',
  page_view: 'Page views',
  link_click: 'Link clicks',
  cv_download: 'CV downloads',
  export_download: 'Export downloads',
  share_open: 'Share links opened',
  video_play: 'Video plays',
};

export const label = (key: string) => LABELS[key] ?? key;

export const pathsAsItems = (paths: AnalyticsPayload['topPaths']): BreakdownItem[] =>
  paths.map((p) => ({ key: p.path, count: p.count }));

type LegacyTotals = Partial<AnalyticsTotals> & { uniqueVisitors?: number; contactSubmissions?: number };

/**
 * Fills fields an older API version does not send, so the admin never crashes when the
 * frontend and the API are deployed at different times.
 */
export function normalizeAnalytics(
  raw: Partial<Omit<AnalyticsPayload, 'totals'>> & { totals?: LegacyTotals },
): AnalyticsPayload {
  const t: LegacyTotals = raw.totals ?? {};
  const series = Array.isArray(raw.series) ? raw.series : [];
  const list = <T,>(v: T[] | undefined) => (Array.isArray(v) ? v : []);
  return {
    range: raw.range ?? '30d',
    since: raw.since ?? series[0]?.date ?? '',
    totals: {
      views: t.views ?? 0,
      visitors: t.visitors ?? t.uniqueVisitors ?? 0,
      cvDownloads: t.cvDownloads ?? 0,
      linkClicks: t.linkClicks ?? 0,
      shareOpens: t.shareOpens ?? 0,
      videoPlays: t.videoPlays ?? 0,
      messages: t.messages ?? t.contactSubmissions ?? 0,
    },
    previous: raw.previous ?? null,
    series,
    topPaths: list(raw.topPaths),
    topProjects: list(raw.topProjects),
    referrers: list(raw.referrers),
    countries: list(raw.countries),
    devices: list(raw.devices),
    locales: list(raw.locales),
    campaigns: list(raw.campaigns),
    clicks: list(raw.clicks),
    eventTypes: list(raw.eventTypes),
  };
}
