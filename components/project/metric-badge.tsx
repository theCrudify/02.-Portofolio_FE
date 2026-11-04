export interface MetricBadgeProps {
  metrics: { label: string; value: string }[];
}

export function MetricBadgeGrid({ metrics }: MetricBadgeProps) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {metrics.map((metric, idx) => (
        <div
          key={`${metric.label}-${idx}`}
          className="rounded-md border border-border bg-card p-5"
        >
          <p className="font-heading text-2xl font-bold tracking-tight text-primary md:text-3xl">
            {metric.value}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
