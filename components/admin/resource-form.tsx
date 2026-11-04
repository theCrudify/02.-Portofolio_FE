'use client';

import * as React from 'react';
import type { AdminResourceMeta } from '@/lib/admin/resources';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BilingualField } from './bilingual-field';

export function ResourceForm({
  meta,
  initialValues = {},
  onSubmit,
  onCancel,
  submitting = false,
}: {
  meta: AdminResourceMeta;
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
        {meta.fields.map((field) => {
          if (field.type === 'bilingual_text' || field.type === 'bilingual_textarea') {
            const keyId = field.nameId ?? `${field.name}Id`;
            const keyEn = field.nameEn ?? `${field.name}En`;
            return (
              <BilingualField
                key={field.name}
                label={field.label}
                required={field.required}
                multiline={field.type === 'bilingual_textarea'}
                valueId={String(values[keyId] ?? '')}
                valueEn={String(values[keyEn] ?? '')}
                onChangeId={(v) => setField(keyId, v)}
                onChangeEn={(v) => setField(keyEn, v)}
              />
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={`field-${field.name}`}>{field.label}</Label>
                <select
                  id={`field-${field.name}`}
                  value={String(values[field.name] ?? field.options?.[0]?.value ?? '')}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === 'checkbox') {
            return (
              <label key={field.name} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(values[field.name])}
                  onChange={(e) => setField(field.name, e.target.checked)}
                />
                <span>{field.label}</span>
              </label>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={`field-${field.name}`}>{field.label}</Label>
                <Textarea
                  id={`field-${field.name}`}
                  value={String(values[field.name] ?? '')}
                  onChange={(e) => setField(field.name, e.target.value)}
                  required={field.required}
                />
              </div>
            );
          }

          return (
            <div key={field.name} className="space-y-1">
              <Label htmlFor={`field-${field.name}`}>{field.label}</Label>
              <Input
                id={`field-${field.name}`}
                type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                value={String(values[field.name] ?? '')}
                onChange={(e) => setField(field.name, e.target.value)}
                required={field.required}
              />
            </div>
          );
        })}
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

