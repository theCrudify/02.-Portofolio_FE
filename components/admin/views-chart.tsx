'use client';

export interface DailySeriesPoint {
  date: string;
  views: number;
  visitors: number;
}

export function ViewsChart({
  series,
  title = 'Daily Page Views & Visitors',
}: {
  series: DailySeriesPoint[];
  title?: string;
}) {
  const totalViews = series.reduce((sum, d) => sum + d.views, 0);
  if (series.length === 0 || totalViews === 0) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        <span className="font-medium text-foreground">No visits recorded for this period yet.</span>
        <span>Visits from the public site appear here right away (admin sessions and bots are not counted).</span>
      </div>
    );
  }

  const maxViews = Math.max(1, ...series.map((d) => d.views));
  const best = series.reduce((a, b) => (b.views > a.views ? b : a));
  // Long ranges: label every Nth day so the axis stays readable.
  const labelEvery = Math.ceil(series.length / 15);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-primary/30" /> Views
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-primary" /> Visitors
          </span>
          <span>
            Busiest: {best.date.slice(5)} ({best.views})
          </span>
        </div>
      </div>
      <div className="mt-4 flex h-44 items-end gap-1 pt-4">
        {series.map((pt, i) => (
          <div
            key={pt.date}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
            title={`${pt.date}: ${pt.views} views, ${pt.visitors} visitors`}
          >
            <div
              className="relative w-full rounded-t bg-primary/30 transition-colors group-hover:bg-primary/45"
              style={{ height: `${pt.views ? Math.max(4, (pt.views / maxViews) * 100) : 1}%` }}
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-t bg-primary"
                style={{ height: `${pt.views ? (pt.visitors / pt.views) * 100 : 0}%` }}
              />
            </div>
            <span className="h-3 text-[10px] text-muted-foreground">
              {i % labelEvery === 0 ? pt.date.slice(5) : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
