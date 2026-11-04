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

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Daily Page Views & Unique Visitors</h3>
      <div className="mt-4 flex h-44 items-end gap-1.5 pt-4">
        {series.map((pt) => {
          const heightPct = Math.max(6, Math.round((pt.views / maxViews) * 100));
          return (
            <div key={pt.date} className="group flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-primary/80 transition-all group-hover:bg-primary"
                style={{ height: `${heightPct}%` }}
                title={`${pt.date}: ${pt.views} views (${pt.visitors} unique)`}
              />
              <span className="text-[10px] text-muted-foreground">{pt.date.slice(5)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
