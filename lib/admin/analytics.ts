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
