import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  href?: string;
  loading?: boolean;
  /** Same metric for the previous period; shows a trend line when given. */
  previous?: number | null;
  /** Label for the comparison, e.g. "vs previous 7 days". */
  previousLabel?: string;
}

function Trend({ value, previous, label }: { value: number; previous: number; label?: string }) {
  const diff = value - previous;
  const text =
    previous === 0
      ? diff === 0
        ? 'No change'
        : `+${diff} (new)`
      : `${diff >= 0 ? '+' : ''}${Math.round((diff / previous) * 100)}%`;
  return (
    <div className="mt-1 text-xs text-muted-foreground">
      <span
        className={cn(
          'font-semibold',
          diff > 0 && 'text-success',
          diff < 0 && 'text-destructive',
        )}
      >
        {diff > 0 ? '▲ ' : diff < 0 ? '▼ ' : ''}
        {text}
      </span>{' '}
      {label}
    </div>
  );
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  href,
  loading,
  previous,
  previousLabel,
}: StatCardProps) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
        {Icon && <Icon className="h-4 w-4 shrink-0 group-hover:text-primary" aria-hidden />}
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-16" />
      ) : (
        <div className="mt-2 font-mono text-3xl font-bold text-foreground">{value}</div>
      )}
      {!loading && typeof value === 'number' && previous != null && (
        <Trend value={value} previous={previous} label={previousLabel} />
      )}
      {subtext && <div className="mt-1 text-xs text-muted-foreground">{subtext}</div>}
    </>
  );
  const box = 'group rounded-lg border border-border bg-card p-4';
  return href ? (
    <Link
      href={href}
      className={cn(
        box,
        'transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      {body}
    </Link>
  ) : (
    <div className={box}>{body}</div>
  );
}
