'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const PAGE_SIZE = 50;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/** Page numbers around the current one, with gaps: 1 … 4 5 [6] 7 8 … 20. */
export function pageWindow(page: number, pages: number): (number | 'gap')[] {
  const wanted = new Set([1, pages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => wanted.add(p));
  if (page >= pages - 2) [pages - 3, pages - 2, pages - 1].forEach((p) => wanted.add(p));
  const list = [...wanted].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  return list.flatMap((p, i) => (i > 0 && p - list[i - 1]! > 1 ? (['gap', p] as const) : [p]));
}

/**
 * "Showing 11–20 of 57" + page size + numbered pages. Renders whenever there are rows, so the
 * range and page size stay visible even on a single page.
 */
export function Pager({
  page,
  total,
  limit = PAGE_SIZE,
  onPage,
  onLimit,
  className,
}: {
  page: number;
  total: number;
  limit?: number;
  onPage: (page: number) => void;
  /** Shows the page-size selector when given. */
  onLimit?: (limit: number) => void;
  className?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (total === 0) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const nav = (target: number, label: string, icon: React.ReactNode, disabled: boolean) => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-8 w-8"
      disabled={disabled}
      onClick={() => onPage(target)}
      aria-label={label}
    >
      {icon}
    </Button>
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between', className)}
    >
      <div className="flex items-center gap-3 text-muted-foreground">
        <span aria-live="polite">
          Showing <strong className="font-semibold text-foreground">{from}</strong>–
          <strong className="font-semibold text-foreground">{to}</strong> of{' '}
          <strong className="font-semibold text-foreground">{total}</strong>
        </span>
        {onLimit ? (
          <label className="flex items-center gap-2">
            <span className="hidden sm:inline">Rows</span>
            <select
              value={limit}
              onChange={(e) => onLimit(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Rows per page"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {pages > 1 ? (
        <div className="flex items-center gap-1">
          {nav(1, 'First page', <ChevronsLeft className="h-4 w-4" />, page <= 1)}
          {nav(page - 1, 'Previous page', <ChevronLeft className="h-4 w-4" />, page <= 1)}
          {pageWindow(page, pages).map((p, i) =>
            p === 'gap' ? (
              <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden="true">
                …
              </span>
            ) : (
              <Button
                key={p}
                type="button"
                variant={p === page ? 'default' : 'ghost'}
                size="sm"
                className="h-8 min-w-8 px-2 tabular-nums"
                aria-current={p === page ? 'page' : undefined}
                onClick={() => onPage(p)}
              >
                {p}
              </Button>
            ),
          )}
          {nav(page + 1, 'Next page', <ChevronRight className="h-4 w-4" />, page >= pages)}
          {nav(pages, 'Last page', <ChevronsRight className="h-4 w-4" />, page >= pages)}
        </div>
      ) : null}
    </nav>
  );
}
