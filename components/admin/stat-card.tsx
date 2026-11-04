export function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-mono text-3xl font-bold text-foreground">{value}</div>
      {subtext && <div className="mt-1 text-xs text-muted-foreground">{subtext}</div>}
    </div>
  );
}
