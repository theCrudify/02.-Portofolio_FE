'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api/client';
import { ADMIN_RESOURCES, type AdminResourceKey, type AdminResourceMeta } from '@/lib/admin/resources';
import { useAdminList } from '@/lib/admin/use-admin-list';
import { DataTable, type DataRow, type SortChoice, type StatusFilter } from '@/components/admin/data-table';
import { Pager } from '@/components/admin/pager';
import { ResourceForm } from '@/components/admin/resource-form';

/** Column header from the form field that edits it ("roleEn" -> "Role / position"). */
function columnLabel(meta: AdminResourceMeta, column: string | undefined) {
  if (!column) return undefined;
  const field = meta.fields.find((f) => f.name === column || f.nameEn === column);
  return field?.label.split(' (')[0];
}

export default function AdminGenericContentPage() {
  const params = useParams<{ resource: string }>();
  const meta = ADMIN_RESOURCES[params.resource as AdminResourceKey];

  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [sort, setSort] = React.useState<SortChoice>('default');
  const [editing, setEditing] = React.useState<Record<string, unknown> | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const list = useAdminList<DataRow>(`/v1/admin/${meta?.key ?? params.resource}`, {
    status: status === 'all' ? undefined : status,
    // "default" keeps the API's display order (sortOrder, then newest).
    sortBy: sort === 'default' ? undefined : meta?.primaryColumn,
    sortOrder: sort === 'default' ? undefined : sort,
  });

  // The route segment changes without remounting: start each resource fresh.
  React.useEffect(() => {
    setStatus('all');
    setSort('default');
    setEditing(null);
    list.setSearch('');
    // Reset only when the resource changes (list.setSearch is stable).
  }, [params.resource]);

  if (!meta) {
    return <div className="p-4 text-sm text-destructive">Unknown content resource.</div>;
  }

  async function run(action: () => Promise<unknown>, failure: string) {
    setActionError(null);
    try {
      await action();
      await list.reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : failure);
    }
  }

  async function handleSubmit(values: Record<string, unknown>) {
    await run(async () => {
      const id = editing?.id ? `/${String(editing.id)}` : '';
      await apiFetch(`/v1/admin/${meta.key}${id}`, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(values),
      });
      setEditing(null);
    }, 'Failed to save item.');
  }

  const error = actionError ?? list.error;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{meta.title}</h1>
        <p className="text-sm text-muted-foreground">{meta.description}</p>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {editing !== null ? (
        <ResourceForm
          key={String(editing.id ?? 'new')}
          meta={meta}
          initialValues={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      <div className="space-y-4">
        <DataTable
          items={list.items}
          offset={list.offset}
          loading={list.loading}
          primaryColumn={meta.primaryColumn}
          secondaryColumn={meta.secondaryColumn}
          primaryLabel={columnLabel(meta, meta.primaryColumn)}
          secondaryLabel={columnLabel(meta, meta.secondaryColumn)}
          status={status}
          onStatus={setStatus}
          search={list.search}
          onSearch={list.setSearch}
          sort={sort}
          onSort={setSort}
          onCreate={() => setEditing({})}
          onEdit={(item) =>
            // The list has parent rows only; the detail adds child collections for the form.
            void run(async () => {
              const res = await apiFetch<Record<string, unknown>>(`/v1/admin/${meta.key}/${item.id}`);
              setEditing(res.data);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 'Failed to load item.')
          }
          onTransition={(id, action) =>
            void run(() => apiFetch(`/v1/admin/${meta.key}/${id}/${action}`, { method: 'POST' }), `Failed to ${action}.`)
          }
          onSoftDelete={(id) =>
            void run(() => apiFetch(`/v1/admin/${meta.key}/${id}`, { method: 'DELETE' }), 'Failed to move to trash.')
          }
          onPermanentDelete={(id) =>
            void run(
              () => apiFetch(`/v1/admin/${meta.key}/${id}/permanent`, { method: 'DELETE' }),
              'Failed to delete.',
            )
          }
        />
        <Pager page={list.page} total={list.total} limit={list.limit} onPage={list.setPage} onLimit={list.setLimit} />
      </div>
    </div>
  );
}
