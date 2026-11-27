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
          className="rounded-2xl border border-primary/25 bg-primary/5 p-5 md:p-6"
        >
          <p className="font-heading text-4xl font-bold tracking-tight text-primary md:text-5xl">
            {metric.value}
          </p>
          <p className="mt-2 text-sm font-medium text-foreground/80">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}

