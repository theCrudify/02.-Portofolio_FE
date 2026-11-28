'use client';

export interface DailySeriesPoint {
  date: string;
  views: number;
  visitors: number;
}

export function ViewsChart({ series }: { series: DailySeriesPoint[] }) {
  if (series.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        No analytics data recorded for this period yet.
      </div>
    );
  }

  const maxViews = Math.max(1, ...series.map((d) => d.views));
  const totalViews = series.reduce((sum, d) => sum + d.views, 0);
  // Long ranges: label every Nth day so the axis stays readable.
  const labelEvery = Math.ceil(series.length / 15);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Daily Page Views</h3>
        <span className="text-xs text-muted-foreground">
          {totalViews.toLocaleString()} views · peak {maxViews.toLocaleString()}/day
        </span>
      </div>
      <div className="mt-4 flex h-44 items-end gap-1.5 pt-4">
        {series.map((pt, i) => {
          const heightPct = Math.max(6, Math.round((pt.views / maxViews) * 100));
          return (
            <div key={pt.date} className="group flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div
                className="w-full rounded-t bg-primary/80 transition-all group-hover:bg-primary"
                style={{ height: `${heightPct}%` }}
                title={`${pt.date}: ${pt.views} views (${pt.visitors} unique)`}
              />
              <span className="h-3 text-[10px] text-muted-foreground">
                {i % labelEvery === 0 ? pt.date.slice(5) : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

