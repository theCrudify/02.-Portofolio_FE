'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api/client';
import { DataTable, type DataRow } from '@/components/admin/data-table';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<DataRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const loadProjects = React.useCallback(async () => {
    try {
      const res = await apiFetch<DataRow[]>('/v1/admin/projects');
      setItems(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load projects.');
    }
  }, []);

  React.useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  async function handleTransition(
    id: string,
    action: 'publish' | 'unpublish' | 'archive' | 'restore'
  ) {
    try {
      await apiFetch(`/v1/admin/projects/${id}/${action}`, { method: 'POST' });
      await loadProjects();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : `Failed to ${action} project.`);
    }
  }

  async function handleSoftDelete(id: string) {
    try {
      await apiFetch(`/v1/admin/projects/${id}`, { method: 'DELETE' });
      await loadProjects();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to soft-delete project.');
    }
  }

  async function handlePermanentDelete(id: string) {
    try {
      await apiFetch(`/v1/admin/projects/${id}/permanent`, { method: 'DELETE' });
      await loadProjects();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to permanently delete project.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Create, edit, reorder, and publish portfolio case studies.
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

      <DataTable
        items={items}
        primaryColumn="titleEn"
        secondaryColumn="category"
        onCreate={() => router.push('/admin/projects/new')}
        onEdit={(item) => router.push(`/admin/projects/${item.id}`)}
        onTransition={handleTransition}
        onSoftDelete={handleSoftDelete}
        onPermanentDelete={handlePermanentDelete}
      />
    </div>
  );
}
