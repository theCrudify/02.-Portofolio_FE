'use client';

import { Button } from '@/components/ui/button';

export const PAGE_SIZE = 50;

export function Pager({
  page,
  total,
  limit = PAGE_SIZE,
  onPage,
}: {
  page: number;
  total: number;
  limit?: number;
  onPage: (page: number) => void;
}) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-end gap-2 text-sm">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        Previous
      </Button>
      <span className="text-muted-foreground" aria-live="polite">
        Page {page} of {pages} ({total} items)
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
