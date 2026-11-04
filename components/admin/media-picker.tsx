'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface MediaAssetItem {
  id: string;
  provider: 'cloudinary' | 'youtube' | 'vimeo' | 'loom';
  kind: 'image' | 'video' | 'document';
  url: string;
  thumbnailUrl?: string | null;
  titleEn?: string | null;
  altEn?: string | null;
  bytes?: number | null;
}

export function MediaPicker({
  value,
  onChange,
  acceptKind = 'image',
  label = 'Media Asset',
}: {
  value?: string | null;
  onChange: (mediaId: string | null, asset?: MediaAssetItem) => void;
  acceptKind?: 'image' | 'video' | 'document';
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [library, setLibrary] = React.useState<MediaAssetItem[]>([]);
  const [embedUrl, setEmbedUrl] = React.useState('');
  const [titleEn, setTitleEn] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const loadLibrary = React.useCallback(async () => {
    try {
      const res = await apiFetch<MediaAssetItem[]>(`/v1/admin/media?kind=${acceptKind}`);
      setLibrary(res.data);
    } catch {
      // Ignored if media endpoint not yet populated
    }
  }, [acceptKind]);

  React.useEffect(() => {
    if (open) {
      void loadLibrary();
    }
  }, [open, loadLibrary]);

  async function handleEmbedSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await apiFetch<MediaAssetItem>('/v1/admin/media/embed', {
        method: 'POST',
        body: JSON.stringify({ url: embedUrl, titleEn: titleEn || undefined }),
      });
      onChange(res.data.id, res.data);
      setOpen(false);
      setEmbedUrl('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to embed video URL.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
              Clear
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(!open)}>
            {open ? 'Close Picker' : value ? 'Change Media' : 'Select Media'}
          </Button>
        </div>
      </div>

      {value && (
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
          Selected Media ID: {value}
        </div>
      )}

      {open && (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          {error && (
            <div className="mb-3 rounded border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
              {error}
            </div>
          )}
          <Tabs defaultValue="library">
            <TabsList>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="upload">Direct Upload</TabsTrigger>
              <TabsTrigger value="embed">Video Link (YouTube/Vimeo/Loom)</TabsTrigger>
            </TabsList>

            <TabsContent value="library">
              {library.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No media assets found in library.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {library.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.id, item);
                        setOpen(false);
                      }}
                      className="flex flex-col items-start rounded border border-border p-2 text-left text-xs hover:border-primary"
                    >
                      <span className="line-clamp-1 font-medium">
                        {item.titleEn || item.altEn || item.id.slice(0, 8)}
                      </span>
                      <span className="text-muted-foreground">{item.provider}</span>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload">
              <p className="text-xs text-muted-foreground">
                Uploads directly to Cloudinary using a signed upload signature from{' '}
                <code>/v1/admin/media/sign</code>.
              </p>
            </TabsContent>

            <TabsContent value="embed">
              <form onSubmit={handleEmbedSubmit} className="space-y-2">
                <Input
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <Input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Video title (optional)"
                />
                <Button type="submit" size="sm" disabled={busy}>
                  {busy ? 'Saving...' : 'Add Video Embed'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
