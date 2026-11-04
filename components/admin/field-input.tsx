'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ResourceFieldDef } from '@/lib/admin/resources';
import { useLookupOptions, useReferenceOptions } from '@/lib/admin/master-data';
import { BilingualField } from './bilingual-field';
import { MediaPicker } from './media-picker';

type Values = Record<string, unknown>;

const selectClass =
  'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** Empty optional inputs are sent as null so the API clears the column. */
const orNull = (v: string) => (v === '' ? null : v);

function LookupSelect({
  field,
  id,
  value,
  onChange,
}: {
  field: ResourceFieldDef;
  id: string;
  value: unknown;
  onChange: (v: string | null) => void;
}) {
  const options = useLookupOptions(field.group ?? '');
  return (
    <select
      id={id}
      value={String(value ?? '')}
      required={field.required}
      onChange={(e) => onChange(orNull(e.target.value))}
      className={selectClass}
    >
      <option value="">{field.required ? 'Select…' : '—'}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ReferenceSelect({
  field,
  id,
  value,
  onChange,
}: {
  field: ResourceFieldDef;
  id: string;
  value: unknown;
  onChange: (v: string | null) => void;
}) {
  const options = useReferenceOptions(
    field.resource ?? '',
    field.optionLabel ?? ((row) => String(row.id)),
  );
  return (
    <select
      id={id}
      value={String(value ?? '')}
      required={field.required}
      onChange={(e) => onChange(orNull(e.target.value))}
      className={selectClass}
    >
      <option value="">{field.required ? 'Select…' : '—'}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** A child collection: rows of sub-fields that can be added, removed and reordered. */
function RepeaterField({
  field,
  value,
  onChange,
}: {
  field: ResourceFieldDef;
  value: unknown;
  onChange: (rows: Values[]) => void;
}) {
  const rows = Array.isArray(value) ? (value as Values[]) : [];
  const itemFields = field.itemFields ?? [];
  const update = (i: number, next: Values) => onChange(rows.map((r, j) => (j === i ? next : r)));
  const move = (i: number, by: -1 | 1) => {
    const j = i + by;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <fieldset className="space-y-3 rounded-md border border-border p-4">
      <legend className="px-1 text-sm font-medium">{field.label}</legend>
      {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
      {rows.map((row, i) => (
        <div key={i} className="space-y-3 rounded-md border border-border/70 bg-muted/30 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {itemFields.map((sub) => (
              <div
                key={sub.name}
                className={sub.type.startsWith('bilingual') || sub.type === 'media' ? 'sm:col-span-2' : ''}
              >
                <FieldInput
                  field={sub}
                  values={row}
                  idPrefix={`${field.name}-${i}`}
                  onChange={(key, v) => update(i, { ...row, [key]: v })}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-1">
            <Button type="button" size="sm" variant="ghost" aria-label="Move up" onClick={() => move(i, -1)}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" aria-label="Move down" onClick={() => move(i, 1)}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="Remove"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...rows, {}])}>
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </fieldset>
  );
}

export function FieldInput({
  field,
  values,
  onChange,
  idPrefix = 'field',
}: {
  field: ResourceFieldDef;
  values: Values;
  onChange: (key: string, value: unknown) => void;
  idPrefix?: string;
}) {
  const id = `${idPrefix}-${field.name}`;

  if (field.type === 'bilingual_text' || field.type === 'bilingual_textarea') {
    const keyId = field.nameId ?? `${field.name}Id`;
    const keyEn = field.nameEn ?? `${field.name}En`;
    return (
      <BilingualField
        label={field.label}
        required={field.required}
        multiline={field.type === 'bilingual_textarea'}
        valueId={String(values[keyId] ?? '')}
        valueEn={String(values[keyEn] ?? '')}
        onChangeId={(v) => onChange(keyId, orNull(v))}
        onChangeEn={(v) => onChange(keyEn, field.required ? v : orNull(v))}
      />
    );
  }

  if (field.type === 'repeater') {
    return <RepeaterField field={field} value={values[field.name]} onChange={(rows) => onChange(field.name, rows)} />;
  }

  if (field.type === 'media') {
    return (
      <MediaPicker
        label={field.label}
        acceptKind={field.mediaKind ?? 'image'}
        value={(values[field.name] as string | null | undefined) ?? null}
        onChange={(mediaId) => onChange(field.name, mediaId)}
      />
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex min-h-10 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(values[field.name])}
          onChange={(e) => onChange(field.name, e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  const control = (() => {
    if (field.type === 'lookup') {
      return <LookupSelect field={field} id={id} value={values[field.name]} onChange={(v) => onChange(field.name, v)} />;
    }
    if (field.type === 'reference') {
      return (
        <ReferenceSelect field={field} id={id} value={values[field.name]} onChange={(v) => onChange(field.name, v)} />
      );
    }
    if (field.type === 'textarea') {
      return (
        <Textarea
          id={id}
          value={String(values[field.name] ?? '')}
          onChange={(e) => onChange(field.name, orNull(e.target.value))}
          required={field.required}
        />
      );
    }
    if (field.type === 'number') {
      return (
        <Input
          id={id}
          type="number"
          value={values[field.name] == null ? '' : String(values[field.name])}
          onChange={(e) => onChange(field.name, e.target.value === '' ? null : Number(e.target.value))}
          required={field.required}
        />
      );
    }
    return (
      <Input
        id={id}
        type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
        value={String(values[field.name] ?? '')}
        onChange={(e) => onChange(field.name, field.required ? e.target.value : orNull(e.target.value))}
        required={field.required}
      />
    );
  })();

  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{field.label}</Label>
      {control}
      {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
    </div>
  );
}
