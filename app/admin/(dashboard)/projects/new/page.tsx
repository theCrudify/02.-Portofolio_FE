'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api/client';
import { ADMIN_RESOURCES } from '@/lib/admin/resources';
import { ResourceForm } from '@/components/admin/resource-form';

export default function AdminNewProjectPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleCreate(values: Record<string, unknown>) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiFetch<{ id: string }>('/v1/admin/projects', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      router.push(`/admin/projects/${res.data.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create project.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Project</h1>
        <p className="text-sm text-muted-foreground">
          New projects are created in draft status first.
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

      <ResourceForm
        meta={ADMIN_RESOURCES.projects}
        onSubmit={handleCreate}
        onCancel={() => router.push('/admin/projects')}
        submitting={submitting}
      />
    </div>
  );
}

