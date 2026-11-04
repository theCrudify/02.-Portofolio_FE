'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { ADMIN_RESOURCES } from '@/lib/admin/resources';
import { DataTable, type DataRow } from '@/components/admin/data-table';
import { PAGE_SIZE, Pager } from '@/components/admin/pager';
import { ResourceForm } from '@/components/admin/resource-form';

export default function AdminTechnologiesPage() {
  const [items, setItems] = React.useState<DataRow[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [editing, setEditing] = React.useState<Record<string, unknown> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const loadItems = React.useCallback(async () => {
    try {
      const res = await apiFetch<DataRow[]>(`/v1/admin/technologies?page=${page}&limit=${PAGE_SIZE}`);
      setItems(res.data);
      setTotal(res.meta?.total ?? res.data.length);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load technologies.');
    }
  }, [page]);

  React.useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleSubmit(values: Record<string, unknown>) {
    setError(null);
    try {
      if (editing?.id) {
        await apiFetch(`/v1/admin/technologies/${String(editing.id)}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
      } else {
        await apiFetch('/v1/admin/technologies', {
          method: 'POST',
          body: JSON.stringify(values),
        });
      }
      setEditing(null);
      await loadItems();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save technology.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Technologies & Skills</h1>
        <p className="text-sm text-muted-foreground">
          Manage skills, categories, proficiency, and skill highlights.
        </p>
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
          meta={ADMIN_RESOURCES.technologies}
          initialValues={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      <DataTable
        items={items}
        primaryColumn="name"
        secondaryColumn="category"
        onCreate={() => setEditing({ category: 'language', isHighlighted: true })}
        onEdit={(item) => setEditing(item)}
        onTransition={async (id, action) => {
          await apiFetch(`/v1/admin/technologies/${id}/${action}`, { method: 'POST' });
          await loadItems();
        }}
        onSoftDelete={async (id) => {
          await apiFetch(`/v1/admin/technologies/${id}`, { method: 'DELETE' });
          await loadItems();
        }}
        onPermanentDelete={async (id) => {
          await apiFetch(`/v1/admin/technologies/${id}/permanent`, { method: 'DELETE' });
          await loadItems();
        }}
      />
      <Pager page={page} total={total} onPage={setPage} />
    </div>
  );
}

