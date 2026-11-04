'use client';

import { Lock, Plus, Save, Trash2 } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LookupIcon } from '@/components/ui/lookup-icon';
import {
  invalidateLookups,
  useLookupGroups,
  type AdminLookupGroup,
  type AdminLookupValue,
} from '@/lib/admin/master-data';
import { apiFetch, ApiError } from '@/lib/api/client';
import { cn } from '@/lib/utils';

type Draft = Pick<AdminLookupValue, 'labelEn' | 'labelId' | 'icon' | 'color' | 'isActive' | 'sortOrder'>;

const toDraft = (v: AdminLookupValue): Draft => ({
  labelEn: v.labelEn,
  labelId: v.labelId,
  icon: v.icon,
  color: v.color,
  isActive: v.isActive,
  sortOrder: v.sortOrder,
});

function ValueRow({
  value,
  onSaved,
  onError,
}: {
  value: AdminLookupValue;
  onSaved: () => void;
  onError: (msg: string) => void;
}) {
  const [draft, setDraft] = React.useState<Draft>(() => toDraft(value));
  const dirty = JSON.stringify(draft) !== JSON.stringify(toDraft(value));
  const set = <K extends keyof Draft>(key: K, v: Draft[K]) => setDraft((d) => ({ ...d, [key]: v }));

  async function save() {
    try {
      await apiFetch(`/v1/admin/lookups/${value.id}`, { method: 'PUT', body: JSON.stringify(draft) });
      onSaved();
    } catch (err) {
      onError(err instanceof ApiError ? err.message : 'Failed to save value.');
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${value.labelEn}"?`)) return;
    try {
      await apiFetch(`/v1/admin/lookups/${value.id}`, { method: 'DELETE' });
      onSaved();
    } catch (err) {
      onError(err instanceof ApiError ? err.message : 'Failed to delete value.');
    }
  }

  return (
    <tr className="border-b border-border/60 align-top">
      <td className="py-2 pr-2 font-mono text-xs">
        <span className="inline-flex items-center gap-1">
          {value.isSystem ? <Lock aria-label="System value" className="h-3 w-3 text-muted-foreground" /> : null}
          {value.code}
        </span>
      </td>
      <td className="py-2 pr-2">
        <Input aria-label="Label (EN)" value={draft.labelEn} onChange={(e) => set('labelEn', e.target.value)} />
      </td>
      <td className="py-2 pr-2">
        <Input
          aria-label="Label (ID)"
          value={draft.labelId ?? ''}
          onChange={(e) => set('labelId', e.target.value || null)}
        />
      </td>
      <td className="py-2 pr-2">
        <div className="flex items-center gap-2">
          <LookupIcon name={draft.icon} className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input aria-label="Icon" value={draft.icon ?? ''} onChange={(e) => set('icon', e.target.value || null)} />
        </div>
      </td>
      <td className="w-20 py-2 pr-2">
        <Input
          aria-label="Sort order"
          type="number"
          value={draft.sortOrder}
          onChange={(e) => set('sortOrder', Number(e.target.value))}
        />
      </td>
      <td className="py-2 pr-2 text-center">
        <input
          type="checkbox"
          aria-label="Active"
          checked={draft.isActive}
          disabled={value.isSystem}
          onChange={(e) => set('isActive', e.target.checked)}
        />
      </td>
      <td className="py-2 text-right whitespace-nowrap">
        <Button type="button" size="sm" variant="ghost" disabled={!dirty} onClick={save} aria-label="Save">
          <Save className="h-4 w-4" />
        </Button>
        {!value.isSystem ? (
          <Button type="button" size="sm" variant="ghost" onClick={remove} aria-label="Delete">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        ) : null}
      </td>
    </tr>
  );
}

function AddValueForm({ group, onSaved, onError }: { group: AdminLookupGroup; onSaved: () => void; onError: (m: string) => void }) {
  const [code, setCode] = React.useState('');
  const [labelEn, setLabelEn] = React.useState('');
  const [labelId, setLabelId] = React.useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/v1/admin/lookups', {
        method: 'POST',
        body: JSON.stringify({
          groupId: group.id,
          code,
          labelEn,
          labelId: labelId || null,
          sortOrder: group.values.length,
        }),
      });
      setCode('');
      setLabelEn('');
      setLabelId('');
      onSaved();
    } catch (err) {
      onError(err instanceof ApiError ? err.message : 'Failed to add value.');
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-md border border-dashed border-border p-4 sm:grid-cols-4 sm:items-end">
      <div className="space-y-1">
        <Label htmlFor="new-code">Code</Label>
        <Input
          id="new-code"
          required
          pattern="[a-z0-9_\-]+"
          placeholder="repo_mobile"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-label-en">Label (EN)</Label>
        <Input id="new-label-en" required value={labelEn} onChange={(e) => setLabelEn(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-label-id">Label (ID)</Label>
        <Input id="new-label-id" value={labelId} onChange={(e) => setLabelId(e.target.value)} />
      </div>
      <Button type="submit">
        <Plus className="h-4 w-4" />
        Add value
      </Button>
    </form>
  );
}

export default function AdminMasterDataPage() {
  const groups = useLookupGroups();
  const [activeCode, setActiveCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const active = groups?.find((g) => g.code === activeCode) ?? groups?.[0] ?? null;

  const refresh = () => {
    setError(null);
    invalidateLookups();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Master Data</h1>
        <p className="text-sm text-muted-foreground">
          Every dropdown on the site and in the admin comes from here. System values (
          <Lock className="inline h-3 w-3" />) are wired to code: you can relabel them but not delete them.
        </p>
      </div>

      {error ? (
        <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Lookup groups" className="space-y-1">
          {groups?.map((g) => (
            <button
              key={g.code}
              type="button"
              onClick={() => setActiveCode(g.code)}
              className={cn(
                'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active?.code === g.code ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
              )}
            >
              <span>{g.nameEn}</span>
              <span className="font-mono text-xs opacity-70">{g.values.length}</span>
            </button>
          ))}
        </nav>

        {active ? (
          <section className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{active.nameEn}</h2>
              <span className="font-mono text-xs text-muted-foreground">{active.code}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="pb-2">Code</th>
                    <th className="pb-2">Label (EN)</th>
                    <th className="pb-2">Label (ID)</th>
                    <th className="pb-2">Icon</th>
                    <th className="pb-2">Order</th>
                    <th className="pb-2">Active</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {active.values.map((v) => (
                    <ValueRow key={`${v.id}-${v.sortOrder}-${v.labelEn}`} value={v} onSaved={refresh} onError={setError} />
                  ))}
                </tbody>
              </table>
            </div>
            {active.isSystem ? (
              <p className="text-xs text-muted-foreground">
                This group is used by the code; new values can&apos;t be added here.
              </p>
            ) : (
              <AddValueForm group={active} onSaved={refresh} onError={setError} />
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
