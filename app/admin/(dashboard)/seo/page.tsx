'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MediaPicker } from '@/components/admin/media-picker';

export default function AdminSeoPage() {
  const [siteTitleEn, setSiteTitleEn] = React.useState('Jidan — Software Engineer');
  const [siteTitleId, setSiteTitleId] = React.useState('Jidan — Insinyur Perangkat Lunak');
  const [siteDescriptionEn, setSiteDescriptionEn] = React.useState(
    'Backend & Full-Stack Engineer building resilient edge APIs and modern web applications.'
  );
  const [siteDescriptionId, setSiteDescriptionId] = React.useState(
    'Insinyur Backend & Full-Stack yang membangun API edge andal dan aplikasi web modern.'
  );
  const [ogImageMediaId, setOgImageMediaId] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiFetch<Record<string, unknown>>('/v1/admin/settings')
      .then((res) => {
        if (!res.data) return;
        const s = res.data;
        if (typeof s.seoTitleEn === 'string' && s.seoTitleEn) setSiteTitleEn(s.seoTitleEn);
        if (typeof s.seoTitleId === 'string' && s.seoTitleId) setSiteTitleId(s.seoTitleId);
        if (typeof s.seoDescriptionEn === 'string' && s.seoDescriptionEn)
          setSiteDescriptionEn(s.seoDescriptionEn);
        if (typeof s.seoDescriptionId === 'string' && s.seoDescriptionId)
          setSiteDescriptionId(s.seoDescriptionId);
        if (typeof s.ogMediaId === 'string') setOgImageMediaId(s.ogMediaId);
      })
      .catch(() => null);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);
    try {
      await apiFetch('/v1/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({
          siteTitleEn,
          siteTitleId,
          siteDescriptionEn,
          siteDescriptionId,
          ogImageMediaId,
        }),
      });
      setStatusMsg('Global SEO metadata saved.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save SEO settings.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Global SEO & Social Preview</h1>
        <p className="text-sm text-muted-foreground">
          Configure search engine titles (max 70 chars), meta descriptions (max 160 chars), and Open
          Graph cards.
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

      <form onSubmit={handleSave} className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="flex justify-between">
              <Label htmlFor="seo-title-en">Site Title (EN)</Label>
              <span className="text-xs text-muted-foreground">{siteTitleEn.length}/70</span>
            </div>
            <Input
              id="seo-title-en"
              maxLength={70}
              required
              value={siteTitleEn}
              onChange={(e) => setSiteTitleEn(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <div className="flex justify-between">
              <Label htmlFor="seo-title-id">Site Title (ID)</Label>
              <span className="text-xs text-muted-foreground">{siteTitleId.length}/70</span>
            </div>
            <Input
              id="seo-title-id"
              maxLength={70}
              required
              value={siteTitleId}
              onChange={(e) => setSiteTitleId(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="flex justify-between">
              <Label htmlFor="seo-desc-en">Meta Description (EN)</Label>
              <span className="text-xs text-muted-foreground">{siteDescriptionEn.length}/160</span>
            </div>
            <Textarea
              id="seo-desc-en"
              maxLength={160}
              required
              value={siteDescriptionEn}
              onChange={(e) => setSiteDescriptionEn(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <div className="flex justify-between">
              <Label htmlFor="seo-desc-id">Meta Description (ID)</Label>
              <span className="text-xs text-muted-foreground">{siteDescriptionId.length}/160</span>
            </div>
            <Textarea
              id="seo-desc-id"
              maxLength={160}
              required
              value={siteDescriptionId}
              onChange={(e) => setSiteDescriptionId(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <MediaPicker
          label="Default Open Graph Image (1200×630)"
          value={ogImageMediaId}
          onChange={(id) => setOgImageMediaId(id)}
          acceptKind="image"
        />

        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <div className="text-xs font-medium uppercase text-muted-foreground">
            Google Search Result Preview
          </div>
          <div className="mt-2 text-base font-semibold text-primary">{siteTitleEn}</div>
          <div className="text-xs text-muted-foreground">https://portfolio.example.com/en</div>
          <p className="mt-1 text-sm text-foreground">{siteDescriptionEn}</p>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save SEO Settings</Button>
        </div>
      </form>
    </div>
  );
}
