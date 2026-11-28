export interface BreakdownItem {
  key: string;
  count: number;
}

/** "Top N" list with a share-of-total bar per row. */
export function BreakdownList({
  title,
  items,
  formatKey = (k) => k,
  emptyText = 'No data for this period yet.',
  limit,
}: {
  title: string;
  items: BreakdownItem[];
  formatKey?: (key: string) => string;
  emptyText?: string;
  limit?: number;
}) {
  const shown = limit ? items.slice(0, limit) : items;
  const total = items.reduce((sum, i) => sum + i.count, 0) || 1;
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {shown.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="mt-3 space-y-2.5 text-sm">
          {shown.map((item) => {
            const pct = Math.round((item.count / total) * 100);
            return (
              <li key={item.key}>
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate" title={item.key}>
                    {formatKey(item.key)}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    <span className="font-medium text-foreground">{item.count.toLocaleString()}</span> · {pct}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
