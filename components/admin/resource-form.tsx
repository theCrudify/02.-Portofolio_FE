'use client';

import * as React from 'react';
import type { AdminResourceMeta } from '@/lib/admin/resources';
import { Button } from '@/components/ui/button';
import { FieldInput } from './field-input';

export function ResourceForm({
  meta,
  initialValues = {},
  onSubmit,
  onCancel,
  submitting = false,
}: {
  meta: Pick<AdminResourceMeta, 'title' | 'fields'>;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  onCancel?: () => void;
  submitting?: boolean;
}) {
  const [values, setValues] = React.useState<Record<string, unknown>>(initialValues);

  function setField(key: string, val: unknown) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(values);
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 rounded-lg border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-lg font-semibold">
          {initialValues.id ? `Edit ${meta.title}` : `New ${meta.title}`}
        </h2>
      </div>

      <div className="grid gap-4">
        {meta.fields.map((field) => (
          <FieldInput key={field.name} field={field} values={values} onChange={setField} />
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Draft / Changes'}
        </Button>
      </div>
    </form>
  );
}

