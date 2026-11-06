'use client';

import Image from 'next/image';
import * as React from 'react';
import { UPLOAD_ACCEPT, uploadMedia, type MediaAssetItem } from '@/components/admin/media-picker';
import { Pager } from '@/components/admin/pager';
import { useConfirm } from '@/components/admin/confirm-dialog';
import { toast } from 'sonner';
import { useAdminList } from '@/lib/admin/use-admin-list';
import { RoleGate } from '@/components/admin/role-gate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiFetch, ApiError } from '@/lib/api/client';

export default function AdminMediaPage() {
  const [filterKind, setFilterKind] = React.useState<'all' | 'image' | 'video' | 'document'>('all');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  // Server-side page, debounced search and filters; 24 fills the 2/3/4-column grid evenly.
  const list = useAdminList<MediaAssetItem>(
    '/v1/admin/media',
    { kind: filterKind === 'all' ? undefined : filterKind, sortBy: 'createdAt', sortOrder },
    24,
  );
  const { items, search, setSearch } = list;
  const [embedUrl, setEmbedUrl] = React.useState('');
  const [embedTitle, setEmbedTitle] = React.useState('');
  const confirm = useConfirm();

  const loadMedia = list.reload;

  async function handleAddEmbed(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/v1/admin/media/embed', {
        method: 'POST',
        body: JSON.stringify({ url: embedUrl, titleEn: embedTitle || undefined }),
      });
      setEmbedUrl('');
      setEmbedTitle('');
      toast.success('Video added to the Media Library.');
      await loadMedia();
    } catch (err) {
      toast.error('Could not add the video.', { description: err instanceof ApiError ? err.message : undefined });
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const kind = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
        ? 'video'
        : 'document';
    const pending = toast.loading(`Uploading ${file.name}…`);
    try {
      await uploadMedia(file, kind);
      toast.success(`${file.name} uploaded.`, { id: pending });
      await loadMedia();
    } catch (err) {
      toast.error('Upload failed.', { id: pending, description: err instanceof Error ? err.message : undefined });
    }
  }

  async function handleDelete(id: string) {
    const ok = await confirm({
      tone: 'danger',
      title: 'Delete this file?',
      description: 'It is removed from the Media Library. Files still used by content cannot be deleted.',
      confirmLabel: 'Delete',
    });
    if (!ok) return;
    try {
      await apiFetch(`/v1/admin/media/${id}`, { method: 'DELETE' });
      toast.success('File deleted.');
      await loadMedia();
    } catch (err) {
      // 409: still referenced; the details name where it is used.
      const usage = err instanceof ApiError ? err.details?.map((d) => d.message).join(', ') : undefined;
      toast.error(err instanceof ApiError && err.status === 409 ? 'This file is still in use.' : 'Could not delete the file.', {
        description: usage || (err instanceof ApiError ? err.message : undefined),
      });
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

      {list.error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {list.error}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-4">
        <Label htmlFor="media-upload">
          Upload file (image max 10 MB, MP4/WebM max 25 MB, PDF max 15 MB)
        </Label>
        <Input
          id="media-upload"
          type="file"
          accept={Object.values(UPLOAD_ACCEPT).join(',')}
          onChange={handleUpload}
          className="mt-1"
        />
      </div>

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'image', 'video', 'document'] as const).map((k) => (
            <Button
              key={k}
              type="button"
              variant={filterKind === k ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFilterKind(k);
              }}
            >
              {k.toUpperCase()}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search media..."
            className="h-9 w-48 text-xs sm:w-64"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          >
            Sort: {sortOrder.toUpperCase()}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card"
          >
            <div>
              {item.kind === 'image' && item.url ? (
                <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted">
                  <Image
                    src={item.url}
                    alt={item.altEn || item.titleEn || 'Media preview'}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{item.kind}</Badge>
                  <Badge variant="outline">{item.provider}</Badge>
                </div>
                <div className="font-medium text-foreground">
                  {item.titleEn || item.altEn || item.id.slice(0, 12)}
                </div>
                <div className="truncate font-mono text-xs text-muted-foreground">{item.url}</div>
              </div>
            </div>
            <div className="flex justify-end px-4 pb-4">
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
      <Pager page={list.page} total={list.total} limit={list.limit} onPage={list.setPage} onLimit={list.setLimit} />
    </div>
  );
}
