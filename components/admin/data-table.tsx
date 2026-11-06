'use client';

import { Plus, Search, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EmptyState } from './empty-state';
import { RoleGate } from './role-gate';
import { StatusBadge } from './status-badge';

export interface DataRow {
  id: string;
  status?: 'draft' | 'published' | 'archived' | string;
  deletedAt?: string | null;
  sortOrder?: number;
  [key: string]: unknown;
}

/** ISO dates ("2023-01-01") read as "Jan 1, 2023"; everything else as text. */
function formatCell(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  const text = String(value);
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return text;
  return new Date(text).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export type StatusFilter = 'all' | 'draft' | 'published' | 'archived';
export type SortChoice = 'default' | 'asc' | 'desc';

/** Search box used by every admin list; the value is sent to the API by the caller. */
export function TableSearch({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 pl-8 pr-8"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

/**
 * Content table. Rows, search, status filter and sort are all server-driven (see useAdminList);
 * this component only renders one page and reports what the user picked.
 */
export function DataTable({
  items,
  offset,
  loading,
  primaryColumn,
  secondaryColumn,
  primaryLabel = 'Item',
  secondaryLabel = 'Info',
  status,
  onStatus,
  search,
  onSearch,
  sort,
  onSort,
  onEdit,
  onTransition,
  onSoftDelete,
  onPermanentDelete,
  onCreate,
}: {
  items: DataRow[];
  /** Number of rows before this page, so "No." continues across pages. */
  offset: number;
  loading: boolean;
  primaryColumn: string;
  secondaryColumn?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  status: StatusFilter;
  onStatus: (status: StatusFilter) => void;
  search: string;
  onSearch: (search: string) => void;
  sort: SortChoice;
  onSort: (sort: SortChoice) => void;
  onEdit: (item: DataRow) => void;
  onTransition: (id: string, action: 'publish' | 'unpublish' | 'archive' | 'restore') => void;
  onSoftDelete: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onCreate?: () => void;
}) {
  const columns = secondaryColumn ? 5 : 4;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex w-fit rounded-lg border border-border bg-muted p-1 text-xs" role="tablist">
            {(['all', 'draft', 'published', 'archived'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={status === tab}
                onClick={() => onStatus(tab)}
                className={cn(
                  'rounded-md px-3 py-1.5 font-medium capitalize transition-colors',
                  status === tab ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <TableSearch value={search} onChange={onSearch} placeholder={`Search ${primaryLabel.toLowerCase()}…`} />
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortChoice)}
            aria-label="Sort"
            className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="default">Display order</option>
            <option value="asc">{primaryLabel} A–Z</option>
            <option value="desc">{primaryLabel} Z–A</option>
          </select>
        </div>
        {onCreate ? (
          <Button type="button" onClick={onCreate} size="sm" className="h-9 gap-1.5">
            <Plus className="h-4 w-4" />
            Create new
          </Button>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="w-14 px-4 py-3 text-right">
                No.
              </th>
              <th scope="col" className="px-4 py-3">
                {primaryLabel}
              </th>
              {secondaryColumn ? (
                <th scope="col" className="px-4 py-3">
                  {secondaryLabel}
                </th>
              ) : null}
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={cn('divide-y divide-border', loading && items.length > 0 && 'opacity-60')}>
            {loading && items.length === 0
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i}>
                    <td colSpan={columns} className="px-4 py-3">
                      <div className="h-5 animate-pulse rounded bg-muted motion-reduce:animate-none" />
                    </td>
                  </tr>
                ))
              : items.map((item, i) => {
                  const rowStatus = item.status ?? 'draft';
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-muted-foreground">
                        {offset + i + 1}
                      </td>
                      <td className="max-w-md px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="line-clamp-2 text-left font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {String(item[primaryColumn] ?? item.id)}
                        </button>
                      </td>
                      {secondaryColumn ? (
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {formatCell(item[secondaryColumn])}
                        </td>
                      ) : null}
                      <td className="px-4 py-3">
                        <StatusBadge status={rowStatus} deletedAt={item.deletedAt} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(item)}>
                            Edit
                          </Button>
                          <RoleGate minRole="owner">
                            {rowStatus === 'draft' ? (
                              <Button type="button" size="sm" onClick={() => onTransition(item.id, 'publish')}>
                                Publish
                              </Button>
                            ) : null}
                            {rowStatus === 'published' ? (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => onTransition(item.id, 'unpublish')}
                              >
                                Unpublish
                              </Button>
                            ) : null}
                            {rowStatus === 'draft' || rowStatus === 'published' ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onTransition(item.id, 'archive')}
                              >
                                Archive
                              </Button>
                            ) : null}
                            {rowStatus === 'archived' ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onTransition(item.id, 'restore')}
                                >
                                  Restore
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => onPermanentDelete(item.id)}
                                >
                                  Delete forever
                                </Button>
                              </>
                            ) : null}
                            {!item.deletedAt && rowStatus !== 'archived' ? (
                              <Button type="button" variant="ghost" size="sm" onClick={() => onSoftDelete(item.id)}>
                                Trash
                              </Button>
                            ) : null}
                          </RoleGate>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {!loading && items.length === 0 ? (
        <div className="p-6">
          <EmptyState
            title={search || status !== 'all' ? 'No matching items' : 'No items yet'}
            description={
              search || status !== 'all'
                ? 'Try another search term or status filter.'
                : 'Create the first item to get started.'
            }
            actionLabel={onCreate && !search ? 'Create item' : undefined}
            onAction={onCreate}
          />
        </div>
      ) : null}
    </div>
  );
}
