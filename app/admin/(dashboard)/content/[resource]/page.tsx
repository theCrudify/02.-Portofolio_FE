'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api/client';
import { ADMIN_RESOURCES, type AdminResourceKey } from '@/lib/admin/resources';
import { DataTable, type DataRow } from '@/components/admin/data-table';
import { PAGE_SIZE, Pager } from '@/components/admin/pager';
import { ResourceForm } from '@/components/admin/resource-form';

export default function AdminGenericContentPage() {
  const params = useParams<{ resource: string }>();
  const resourceKey = params.resource as AdminResourceKey;
  const meta = ADMIN_RESOURCES[resourceKey];

  const [items, setItems] = React.useState<DataRow[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [editing, setEditing] = React.useState<Record<string, unknown> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const loadItems = React.useCallback(async () => {
    if (!meta) return;
    try {
      const res = await apiFetch<DataRow[]>(`/v1/admin/${meta.key}?page=${page}&limit=${PAGE_SIZE}`);
      setItems(res.data);
      setTotal(res.meta?.total ?? res.data.length);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : `Failed to load ${meta.title}.`);
    }
  }, [meta, page]);

  // The route segment changes without remounting, so start each resource at page 1.
  React.useEffect(() => setPage(1), [resourceKey]);

  React.useEffect(() => {
    void loadItems();
  }, [loadItems]);

  if (!meta) {
    return <div className="p-4 text-sm text-destructive">Unknown content resource.</div>;
  }

  async function handleSubmit(values: Record<string, unknown>) {
    setError(null);
    try {
      if (editing?.id) {
        await apiFetch(`/v1/admin/${meta.key}/${String(editing.id)}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
      } else {
        await apiFetch(`/v1/admin/${meta.key}`, {
          method: 'POST',
          body: JSON.stringify(values),
        });
      }
      setEditing(null);
      await loadItems();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save item.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{meta.title}</h1>
        <p className="text-sm text-muted-foreground">{meta.description}</p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {editing !== null && (
        <ResourceForm
          meta={meta}
          initialValues={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      <DataTable
        items={items}
        primaryColumn={meta.primaryColumn}
        secondaryColumn={meta.secondaryColumn}
        onCreate={() => setEditing({})}
        onEdit={(item) => setEditing(item)}
        onTransition={async (id, action) => {
          await apiFetch(`/v1/admin/${meta.key}/${id}/${action}`, { method: 'POST' });
          await loadItems();
        }}
        onSoftDelete={async (id) => {
          await apiFetch(`/v1/admin/${meta.key}/${id}`, { method: 'DELETE' });
          await loadItems();
        }}
        onPermanentDelete={async (id) => {
          await apiFetch(`/v1/admin/${meta.key}/${id}/permanent`, { method: 'DELETE' });
          await loadItems();
        }}
      />
      <Pager page={page} total={total} onPage={setPage} />
    </div>
  );
}

