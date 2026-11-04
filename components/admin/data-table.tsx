'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './status-badge';
import { EmptyState } from './empty-state';
import { RoleGate } from './role-gate';

export interface DataRow {
  id: string;
  status?: 'draft' | 'published' | 'archived' | string;
  deletedAt?: string | null;
  sortOrder?: number;
  [key: string]: unknown;
}

export function DataTable({
  items,
  primaryColumn,
  secondaryColumn,
  onEdit,
  onTransition,
  onSoftDelete,
  onPermanentDelete,
  onCreate,
}: {
  items: DataRow[];
  primaryColumn: string;
  secondaryColumn?: string;
  onEdit: (item: DataRow) => void;
  onTransition: (id: string, action: 'publish' | 'unpublish' | 'archive' | 'restore') => void;
  onSoftDelete: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onCreate?: () => void;
}) {
  const [filter, setFilter] = React.useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const filtered = items.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-md border border-border bg-muted p-1 text-xs">
          {(['all', 'draft', 'published', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded px-3 py-1 font-medium capitalize ${
                filter === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {onCreate && (
          <Button type="button" onClick={onCreate} size="sm">
            + Create New
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No items found"
          description="Create a new draft item or adjust the status filter above."
          actionLabel={onCreate ? 'Create Item' : undefined}
          onAction={onCreate}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Item</th>
                {secondaryColumn && <th className="px-4 py-3">Category / Info</th>}
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => {
                const status = item.status ?? 'draft';
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium">
                      {String(item[primaryColumn] ?? item.id)}
                    </td>
                    {secondaryColumn && (
                      <td className="px-4 py-3 text-muted-foreground">
                        {String(item[secondaryColumn] ?? '—')}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <StatusBadge status={status} deletedAt={item.deletedAt} />
                    </td>
                    <td className="space-x-1.5 px-4 py-3 text-right">
                      <Button type="button" variant="outline" size="sm" onClick={() => onEdit(item)}>
                        Edit
                      </Button>

                      <RoleGate minRole="owner">
                        {status === 'draft' && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onTransition(item.id, 'publish')}
                          >
                            Publish
                          </Button>
                        )}
                        {status === 'published' && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => onTransition(item.id, 'unpublish')}
                          >
                            Unpublish
                          </Button>
                        )}
                        {(status === 'draft' || status === 'published') && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onTransition(item.id, 'archive')}
                          >
                            Archive
                          </Button>
                        )}
                        {status === 'archived' && (
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
                              Delete Forever
                            </Button>
                          </>
                        )}
                        {!item.deletedAt && status !== 'archived' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onSoftDelete(item.id)}
                          >
                            Trash
                          </Button>
                        )}
                      </RoleGate>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
