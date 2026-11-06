'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';

export type ListParams = Record<string, string | number | boolean | undefined>;

/**
 * Server-side list state for admin tables: page, page size, debounced search and extra filters
 * all go to the API, so only one page of rows is ever fetched. Changing search, filters or page
 * size returns to page 1; stale responses are dropped.
 */
export function useAdminList<T>(endpoint: string, params: ListParams = {}, initialLimit = 10) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(initialLimit);
  const [search, setSearch] = React.useState('');
  const [debounced, setDebounced] = React.useState('');
  const [items, setItems] = React.useState<T[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const paramsKey = JSON.stringify(params);
  React.useEffect(() => setPage(1), [endpoint, paramsKey, debounced, limit]);

  const query = React.useMemo(() => {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (debounced) qs.set('search', debounced);
    for (const [k, v] of Object.entries(JSON.parse(paramsKey) as ListParams)) {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    }
    return qs.toString();
  }, [page, limit, debounced, paramsKey]);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const res = await apiFetch<T[]>(`${endpoint}?${query}`);
      if (id !== requestId.current) return;
      setItems(res.data);
      setTotal(res.meta?.total ?? res.data.length);
      setError(null);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err instanceof ApiError ? err.message : 'Failed to load data.');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [endpoint, query]);

  React.useEffect(() => {
    void reload();
  }, [reload]);

  return {
    items,
    total,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    /** Row number of the first item on this page, for a "No." column. */
    offset: (page - 1) * limit,
    reload,
  };
}
