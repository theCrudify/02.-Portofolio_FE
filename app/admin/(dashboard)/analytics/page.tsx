'use client';

import * as React from 'react';
import { Download, Eye, Layers, Mail, MousePointerClick, Users } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/admin/stat-card';
import { BreakdownList } from '@/components/admin/breakdown-list';
import { ViewsChart } from '@/components/admin/views-chart';
import {
  countryName,
  label,
  normalizeAnalytics,
  pathsAsItems,
  RANGE_DAYS,
  type AnalyticsPayload,
  type AnalyticsRange,
} from '@/lib/admin/analytics';

export default function AdminAnalyticsPage() {
  const [range, setRange] = React.useState<AnalyticsRange>('30d');
  const [data, setData] = React.useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    apiFetch<AnalyticsPayload>(`/v1/admin/analytics?range=${range}`)
      .then((res) => {
        if (!alive) return;
        setData(normalizeAnalytics(res.data));
        setError(null);
      })
      .catch((err) => alive && setError(err instanceof ApiError ? err.message : 'Failed to load analytics.'))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [range]);

  const t = data?.totals;
  const p = data?.previous ?? null;
  const vsLabel = `vs previous ${RANGE_DAYS[range]} days`;
  const perVisitor = (x?: { views: number; visitors: number } | null) =>
    x && x.visitors ? Math.round((x.views / x.visitors) * 10) / 10 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Cookie-free visitor analytics{data?.since ? ` since ${data.since} (UTC), including today` : ''}.
            Bots and admin sessions are excluded.
          </p>
        </div>
        <div className="flex items-center gap-1.5" role="group" aria-label="Date range">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <Button
              key={r}
              type="button"
              size="sm"
              variant={range === r ? 'default' : 'outline'}
              aria-pressed={range === r}
              onClick={() => setRange(r)}
            >
              Last {RANGE_DAYS[r]} days
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Page Views" icon={Eye} loading={loading} value={t?.views ?? 0} previous={p?.views} previousLabel={vsLabel} />
        <StatCard label="Visitors" icon={Users} loading={loading} value={t?.visitors ?? 0} previous={p?.visitors} previousLabel={vsLabel} subtext="Unique per day, summed" />
        <StatCard label="Pages / Visitor" icon={Layers} loading={loading} value={perVisitor(t)} previous={p ? perVisitor(p) : null} previousLabel={vsLabel} />
        <StatCard label="CV Downloads" icon={Download} loading={loading} value={t?.cvDownloads ?? 0} previous={p?.cvDownloads} previousLabel={vsLabel} />
        <StatCard label="Link Clicks" icon={MousePointerClick} loading={loading} value={t?.linkClicks ?? 0} previous={p?.linkClicks} previousLabel={vsLabel} />
        <StatCard label="Messages" icon={Mail} loading={loading} value={t?.messages ?? 0} previous={p?.messages} previousLabel={vsLabel} href="/admin/messages" />
      </div>
      {range === '90d' && (
        <p className="-mt-3 text-xs text-muted-foreground">
          Raw events are kept for 90 days, so the 90-day view has no previous period to compare with.
        </p>
      )}

      {loading && !data ? <Skeleton className="h-64 w-full" /> : <ViewsChart series={data?.series ?? []} />}

      {data && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <BreakdownList title="Top Pages" items={pathsAsItems(data.topPaths)} />
          <BreakdownList title="Most Viewed Projects" items={data.topProjects} emptyText="No project page views yet." />
          <BreakdownList title="Traffic Sources" items={data.referrers} />
          <BreakdownList title="Countries" items={data.countries} formatKey={countryName} />
          <BreakdownList title="Devices" items={data.devices} formatKey={label} />
          <BreakdownList title="Site Language" items={data.locales} formatKey={label} />
          <BreakdownList title="Clicked Links" items={data.clicks} emptyText="No link clicks yet." />
          <BreakdownList title="Campaigns (utm_source)" items={data.campaigns} emptyText="No UTM-tagged visits yet. Add ?utm_source=linkedin to links you share." />
          <BreakdownList title="All Events" items={data.eventTypes} formatKey={label} />
        </div>
      )}
    </div>
  );
}
