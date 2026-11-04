'use client';

import * as React from 'react';
import { apiFetch } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/admin/stat-card';
import { ViewsChart, type DailySeriesPoint } from '@/components/admin/views-chart';

interface AnalyticsPayload {
  range: '7d' | '30d' | '90d';
  totals: {
    views: number;
    uniqueVisitors: number;
    cvDownloads: number;
    contactSubmissions: number;
  };
  series: DailySeriesPoint[];
  topPaths: { path: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [range, setRange] = React.useState<'7d' | '30d' | '90d'>('30d');
  const [data, setData] = React.useState<AnalyticsPayload | null>(null);

  React.useEffect(() => {
    apiFetch<AnalyticsPayload>(`/v1/admin/analytics?range=${range}`)
      .then((res) => setData(res.data))
      .catch(() => null);
  }, [range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            First-party, cookie-free visitor analytics with daily rotating visitor hashes.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <Button
              key={r}
              type="button"
              size="sm"
              variant={range === r ? 'default' : 'outline'}
              onClick={() => setRange(r)}
            >
              Last {r}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Views" value={data?.totals.views ?? 0} />
        <StatCard label="Unique Visitors" value={data?.totals.uniqueVisitors ?? 0} />
        <StatCard label="CV Downloads" value={data?.totals.cvDownloads ?? 0} />
        <StatCard label="Contact Messages" value={data?.totals.contactSubmissions ?? 0} />
      </div>

      <ViewsChart series={data?.series ?? []} />

      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Top Visited Paths</h2>
        <div className="mt-3 divide-y divide-border text-sm">
          {data?.topPaths.map((p) => (
            <div key={p.path} className="flex items-center justify-between py-2">
              <span className="font-mono text-xs">{p.path}</span>
              <span className="font-medium">{p.count} views</span>
            </div>
          )) ?? <p className="py-2 text-xs text-muted-foreground">No path stats yet.</p>}
        </div>
      </div>
    </div>
  );
}
