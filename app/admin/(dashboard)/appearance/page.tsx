'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { THEME_PALETTES, type ThemePresetName } from '@/lib/theme';

const DEFAULT_SECTIONS = [
  'hero',
  'about',
  'projects',
  'skills',
  'experience',
  'education',
  'certifications',
  'activities',
  'achievements',
  'publications',
  'testimonials',
  'github',
  'contact',
];

export default function AdminAppearancePage() {
  const [colorPreset, setColorPreset] = React.useState<ThemePresetName>('slate');
  const [defaultTheme, setDefaultTheme] = React.useState<'light' | 'dark' | 'system'>('system');
  const [siteTitleId, setSiteTitleId] = React.useState('Portofolio Jidan');
  const [siteTitleEn, setSiteTitleEn] = React.useState('Jidan Portfolio');
  const [siteDescriptionId, setSiteDescriptionId] = React.useState('Portofolio Rekayasa Perangkat Lunak');
  const [siteDescriptionEn, setSiteDescriptionEn] = React.useState('Software Engineering Portfolio');
  const [sections, setSections] = React.useState<
    { key: string; enabled: boolean; order: number }[]
  >(DEFAULT_SECTIONS.map((key, order) => ({ key, enabled: true, order })));
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiFetch<Record<string, unknown>>('/v1/admin/settings')
      .then((res) => {
        if (!res.data) return;
        const s = res.data;
        if (typeof s.themePreset === 'string') setColorPreset(s.themePreset as ThemePresetName);
        if (typeof s.colorPreset === 'string') setColorPreset(s.colorPreset as ThemePresetName);
        if (typeof s.colorMode === 'string')
          setDefaultTheme(s.colorMode as 'light' | 'dark' | 'system');
        if (typeof s.seoTitleEn === 'string' && s.seoTitleEn) setSiteTitleEn(s.seoTitleEn);
        if (typeof s.seoTitleId === 'string' && s.seoTitleId) setSiteTitleId(s.seoTitleId);
        if (typeof s.seoDescriptionEn === 'string' && s.seoDescriptionEn)
          setSiteDescriptionEn(s.seoDescriptionEn);
        if (typeof s.seoDescriptionId === 'string' && s.seoDescriptionId)
          setSiteDescriptionId(s.seoDescriptionId);
      })
      .catch(() => null);
  }, []);

  async function handleSave() {
    setError(null);
    setStatusMsg(null);
    try {
      await apiFetch('/v1/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          siteTitleId,
          siteTitleEn,
          siteDescriptionId,
          siteDescriptionEn,
          colorPreset,
          defaultTheme,
        }),
      });
      setStatusMsg('Appearance & theme preset saved.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save appearance settings.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appearance & Layout</h1>
        <p className="text-sm text-muted-foreground">
          Choose OKLCH color preset, default theme mode, and homepage section ordering.
        </p>
      </div>

      {statusMsg && (
        <div className="rounded-md border border-border bg-muted p-3 text-sm">{statusMsg}</div>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <Label>Color Preset (WCAG AA Verified)</Label>
        <div className="grid gap-3 sm:grid-cols-4">
          {(Object.keys(THEME_PALETTES) as ThemePresetName[]).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setColorPreset(preset)}
              className={`rounded-lg border p-4 text-left capitalize transition-all ${
                colorPreset === preset
                  ? 'border-primary bg-primary/10 font-semibold'
                  : 'border-border hover:bg-muted'
              }`}
            >
              <div>{preset}</div>
              <div className="mt-1 text-xs font-normal text-muted-foreground">
                OKLCH Semantic Tokens
              </div>
            </button>
          ))}
        </div>

        <div className="pt-2">
          <Label htmlFor="default-theme">Default Color Mode</Label>
          <select
            id="default-theme"
            value={defaultTheme}
            onChange={(e) => setDefaultTheme(e.target.value as 'light' | 'dark' | 'system')}
            className="mt-1 flex h-10 w-48 rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="system">System Preference</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card p-6">
        <h2 className="text-base font-semibold">Homepage Sections</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {sections.map((sec, idx) => (
            <label
              key={sec.key}
              className="flex items-center justify-between rounded border border-border px-3 py-2 text-sm"
            >
              <span className="capitalize">
                {idx + 1}. {sec.key}
              </span>
              <input
                type="checkbox"
                checked={sec.enabled}
                onChange={(e) => {
                  const next = [...sections];
                  next[idx] = { ...sec, enabled: e.target.checked };
                  setSections(next);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave}>
          Save Appearance
        </Button>
      </div>
    </div>
  );
}

