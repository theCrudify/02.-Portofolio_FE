'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RoleGate } from '@/components/admin/role-gate';
import type { MediaAssetItem } from '@/components/admin/media-picker';

export default function AdminMediaPage() {
  const [items, setItems] = React.useState<MediaAssetItem[]>([]);
  const [filterKind, setFilterKind] = React.useState<'all' | 'image' | 'video' | 'document'>('all');
  const [embedUrl, setEmbedUrl] = React.useState('');
  const [embedTitle, setEmbedTitle] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const loadMedia = React.useCallback(async () => {
    try {
      const q = filterKind === 'all' ? '' : `?kind=${filterKind}`;
      const res = await apiFetch<MediaAssetItem[]>(`/v1/admin/media${q}`);
      setItems(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load media library.');
    }
  }, [filterKind]);

  React.useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  async function handleAddEmbed(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);
    try {
      await apiFetch('/v1/admin/media/embed', {
        method: 'POST',
        body: JSON.stringify({ url: embedUrl, titleEn: embedTitle || undefined }),
      });
      setEmbedUrl('');
      setEmbedTitle('');
      setStatusMsg('External video embedded into Media Library.');
      await loadMedia();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add video embed.');
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    setStatusMsg(null);
    try {
      await apiFetch(`/v1/admin/media/${id}`, { method: 'DELETE' });
      setStatusMsg('Media asset removed.');
      await loadMedia();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        const usageInfo = err.details?.map((d) => d.message).join(', ') ?? '';
        setError(`${err.message} ${usageInfo}`);
      } else {
        setError(err instanceof ApiError ? err.message : 'Failed to delete media.');
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        <p className="text-sm text-muted-foreground">
          Manage Cloudinary images, short video clips, PDF documents, and YouTube/Vimeo/Loom embeds.
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

      <form
        onSubmit={handleAddEmbed}
        className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3"
      >
        <div>
          <Label htmlFor="embed-url">Video URL (YouTube / Vimeo / Loom)</Label>
          <Input
            id="embed-url"
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="embed-title">Title (Optional)</Label>
          <Input
            id="embed-title"
            value={embedTitle}
            onChange={(e) => setEmbedTitle(e.target.value)}
            placeholder="Demo Video"
            className="mt-1"
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            + Embed External Video
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-2">
        {(['all', 'image', 'video', 'document'] as const).map((k) => (
          <Button
            key={k}
            type="button"
            variant={filterKind === k ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterKind(k)}
          >
            {k.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-lg border border-border bg-card p-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{item.kind}</Badge>
                <Badge variant="outline">{item.provider}</Badge>
              </div>
              <div className="font-medium text-foreground">
                {item.titleEn || item.altEn || item.id.slice(0, 12)}
              </div>
              <div className="truncate font-mono text-xs text-muted-foreground">{item.url}</div>
            </div>
            <div className="mt-4 flex justify-end">
              <RoleGate minRole="owner">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </RoleGate>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
