'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface DocRow {
  id: string;
  title: string;
  type: 'cv' | 'portfolio_pdf' | 'other';
  locale: 'en' | 'id';
  version: number;
  isActive: boolean;
  createdAt: string;
}

interface PresetRow {
  id: string;
  slug: string;
  name: string;
  template: 'full' | 'one_page' | 'ats';
  locale: 'en' | 'id';
  isPublic: boolean;
}

interface ShareLinkRow {
  id: string;
  token: string;
  label: string;
  isActive: boolean;
  viewCount: number;
  expiresAt: string | null;
}

export default function AdminDocumentsPage() {
  const [docs, setDocs] = React.useState<DocRow[]>([]);
  const [presets, setPresets] = React.useState<PresetRow[]>([]);
  const [shares, setShares] = React.useState<ShareLinkRow[]>([]);
  const [shareLabel, setShareLabel] = React.useState('');
  const [sharePresetId, setSharePresetId] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const loadAll = React.useCallback(async () => {
    try {
      const [dRes, pRes, sRes] = await Promise.all([
        apiFetch<DocRow[]>('/v1/admin/documents'),
        apiFetch<PresetRow[]>('/v1/admin/export-presets'),
        apiFetch<ShareLinkRow[]>('/v1/admin/share-links'),
      ]);
      setDocs(dRes.data);
      setPresets(pRes.data);
      setShares(sRes.data);
      if (pRes.data[0] && !sharePresetId) {
        setSharePresetId(pRes.data[0].id);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load documents.');
    }
  }, [sharePresetId]);

  React.useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function handleActivateDoc(id: string) {
    try {
      await apiFetch(`/v1/admin/documents/${id}/activate`, { method: 'POST' });
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to activate document.');
    }
  }

  async function handleCreateShareLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch('/v1/admin/share-links', {
        method: 'POST',
        body: JSON.stringify({
          label: shareLabel,
          presetId: sharePresetId,
        }),
      });
      setShareLabel('');
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create share link.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documents, Export Presets & Share Links</h1>
        <p className="text-sm text-muted-foreground">
          Manage uploaded CV PDFs, dynamic PDF export presets, and trackable private share links.
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

      <Tabs defaultValue="cv">
        <TabsList>
          <TabsTrigger value="cv">CV Documents</TabsTrigger>
          <TabsTrigger value="presets">Export Presets</TabsTrigger>
          <TabsTrigger value="shares">Share Links</TabsTrigger>
        </TabsList>

        <TabsContent value="cv">
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Locale</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {docs.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-4 py-3 font-medium">{doc.title}</td>
                    <td className="px-4 py-3">{doc.type}</td>
                    <td className="px-4 py-3 uppercase">{doc.locale}</td>
                    <td className="px-4 py-3">
                      <Badge variant={doc.isActive ? 'success' : 'secondary'}>
                        {doc.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!doc.isActive && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleActivateDoc(doc.id)}
                        >
                          Set Active
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="presets">
          <div className="grid gap-4 sm:grid-cols-3">
            {presets.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{p.name}</span>
                  <Badge variant={p.isPublic ? 'success' : 'secondary'}>
                    {p.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">
                  /{p.slug} • {p.template} ({p.locale.toUpperCase()})
                </div>
                <div className="mt-4">
                  <a
                    href={`/api/pdf/${p.slug}?locale=${p.locale}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary underline"
                  >
                    Preview PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shares" className="space-y-4">
          <form
            onSubmit={handleCreateShareLink}
            className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3"
          >
            <div>
              <Label htmlFor="share-label">Recipient / Label</Label>
              <Input
                id="share-label"
                value={shareLabel}
                onChange={(e) => setShareLabel(e.target.value)}
                placeholder="PT ABC - Senior Engineer"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="share-preset">Export Preset</Label>
              <select
                id="share-preset"
                value={sharePresetId}
                onChange={(e) => setSharePresetId(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.template})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                + Generate Share Link
              </Button>
            </div>
          </form>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shares.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 font-medium">{s.label}</td>
                    <td className="px-4 py-3 font-mono text-xs">/en/s/{s.token}</td>
                    <td className="px-4 py-3 font-mono">{s.viewCount}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.isActive ? 'success' : 'warning'}>
                        {s.isActive ? 'Active' : 'Revoked'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
