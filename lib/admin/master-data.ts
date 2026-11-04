'use client';

import * as React from 'react';
import { apiFetch } from '@/lib/api/client';

export interface AdminLookupValue {
  id: string;
  groupId: string;
  code: string;
  labelEn: string;
  labelId: string | null;
  icon: string | null;
  color: string | null;
  isSystem: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminLookupGroup {
  id: string;
  code: string;
  nameEn: string;
  nameId: string | null;
  isSystem: boolean;
  values: AdminLookupValue[];
}

// One request per page load; mutations call invalidateLookups() so every picker refreshes.
let lookupsPromise: Promise<AdminLookupGroup[]> | null = null;
const listeners = new Set<() => void>();

export function invalidateLookups(): void {
  lookupsPromise = null;
  listeners.forEach((fn) => fn());
}

function loadLookups(): Promise<AdminLookupGroup[]> {
  lookupsPromise ??= apiFetch<AdminLookupGroup[]>('/v1/admin/lookups').then((res) => res.data);
  return lookupsPromise;
}

/** All master-data groups (with values), from /v1/admin/lookups. */
export function useLookupGroups(): AdminLookupGroup[] | null {
  const [groups, setGroups] = React.useState<AdminLookupGroup[] | null>(null);
  React.useEffect(() => {
    let alive = true;
    const load = () => {
      void loadLookups().then((g) => alive && setGroups(g));
    };
    load();
    listeners.add(load);
    return () => {
      alive = false;
      listeners.delete(load);
    };
  }, []);
  return groups;
}

/** Active values of one lookup group, as select options. */
export function useLookupOptions(groupCode: string) {
  const groups = useLookupGroups();
  return React.useMemo(
    () =>
      (groups?.find((g) => g.code === groupCode)?.values ?? [])
        .filter((v) => v.isActive)
        .map((v) => ({ value: v.id, label: v.labelEn, code: v.code })),
    [groups, groupCode],
  );
}

/** Rows of another admin resource as select options (e.g. organizations, experiences). */
export function useReferenceOptions(
  resource: string,
  label: (row: Record<string, unknown>) => string,
) {
  const [options, setOptions] = React.useState<{ value: string; label: string }[]>([]);
  const labelRef = React.useRef(label);
  labelRef.current = label;
  React.useEffect(() => {
    let alive = true;
    void apiFetch<Record<string, unknown>[]>(`/v1/admin/${resource}?all=true&sort=sortOrder`).then(
      (res) => {
        if (!alive) return;
        setOptions(
          res.data
            .filter((row) => !row.deletedAt)
            .map((row) => ({ value: String(row.id), label: labelRef.current(row) })),
        );
      },
    );
    return () => {
      alive = false;
    };
  }, [resource]);
  return options;
}
