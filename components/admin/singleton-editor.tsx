'use client';

import * as React from 'react';
import { ResourceForm } from '@/components/admin/resource-form';
import type { ResourceFieldDef } from '@/lib/admin/resources';
import { toast } from 'sonner';
import { apiFetch, ApiError } from '@/lib/api/client';

/**
 * Edits a single-row resource (profile, site settings). Only the listed fields are sent, so
 * pages that each own part of the same row (appearance vs SEO) don't overwrite each other.
 */
export function SingletonEditor({
  endpoint,
  title,
  description,
  fields,
}: {
  endpoint: string;
  title: string;
  description: string;
  fields: ResourceFieldDef[];
}) {
  const [values, setValues] = React.useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiFetch<Record<string, unknown>>(endpoint)
      .then((res) => setValues(res.data ?? {}))
      .catch((err) => setError(err instanceof ApiError ? err.message : `Failed to load ${title}.`));
  }, [endpoint, title]);

  const ownKeys = React.useMemo(
    () =>
      fields.flatMap((f) =>
        f.type === 'bilingual_text' || f.type === 'bilingual_textarea'
          ? [f.nameEn ?? `${f.name}En`, f.nameId ?? `${f.name}Id`]
          : [f.name],
      ),
    [fields],
  );

  async function handleSubmit(next: Record<string, unknown>) {
    setSaving(true);
    try {
      const body = Object.fromEntries(ownKeys.filter((k) => k in next).map((k) => [k, next[k]]));
      const res = await apiFetch<Record<string, unknown>>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      setValues(res.data ?? next);
      toast.success(`${title} saved.`, { description: 'The public site is updated.' });
    } catch (err) {
      toast.error(`Could not save ${title}.`, { description: err instanceof ApiError ? err.message : undefined });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {error ? (
        <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      {values ? (
        <ResourceForm
          key={String(values.updatedAt ?? 'loaded')}
          meta={{ title, fields }}
          initialValues={values}
          onSubmit={handleSubmit}
          submitting={saving}
        />
      ) : null}
    </div>
  );
}
