'use client';

import Image from 'next/image';
import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PAGE_SIZE, Pager } from '@/components/admin/pager';

export interface MediaAssetItem {
  id: string;
  /** media_provider code */
  provider: string;
  /** media_kind code: image, video, pdf, document */
  kind: string;
  url: string;
  thumbnailUrl?: string | null;
  titleEn?: string | null;
  altEn?: string | null;
  bytes?: number | null;
}

type UploadKind = 'image' | 'video' | 'document';

interface SignedUpload {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  resourceType: 'image' | 'video' | 'raw';
  signature: string;
  maxBytes: number;
  allowedFormats: string[];
}

const DOCUMENT_ACCEPT =
  'application/pdf,.pptx,.ppt,.key,.odp,.docx,.xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation';

export const UPLOAD_ACCEPT: Record<UploadKind, string> = {
  image: 'image/jpeg,image/png,image/webp,image/avif,image/svg+xml',
  video: 'video/mp4,video/webm',
  document: DOCUMENT_ACCEPT,
};

type PickerKind = UploadKind | 'any';

/** media_kind codes listed for each picker mode ("document" covers PDFs and slide decks). */
const LIST_KINDS: Record<PickerKind, string> = {
  image: 'image',
  video: 'video',
  document: 'pdf,document',
  any: '',
};

function kindOfFile(file: File): UploadKind {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'document';
}

// Signed direct upload: the browser sends the file straight to Cloudinary, then registers it with the API.
export async function uploadMedia(file: File, kind: UploadKind): Promise<MediaAssetItem> {
  const sig = (
    await apiFetch<SignedUpload>('/v1/admin/media/sign', {
      method: 'POST',
      body: JSON.stringify({ kind }),
    })
  ).data;

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!sig.allowedFormats.includes(ext)) {
    throw new Error(`File type .${ext} is not allowed. Use: ${sig.allowedFormats.join(', ')}.`);
  }
  if (file.size > sig.maxBytes) {
    throw new Error(`File is too large. Maximum ${Math.round(sig.maxBytes / 1048576)} MB.`);
  }

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', String(sig.timestamp));
  form.append('folder', sig.folder);
  form.append('signature', sig.signature);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`,
    { method: 'POST', body: form },
  );
  const up = (await res.json()) as {
    public_id?: string;
    secure_url?: string;
    width?: number;
    height?: number;
    bytes?: number;
    duration?: number;
    error?: { message?: string };
  };
  if (!res.ok || !up.public_id || !up.secure_url) {
    throw new Error(up.error?.message ?? 'Upload to Cloudinary failed.');
  }

  const title = file.name.replace(/\.[^.]+$/, '').slice(0, 160);
  const registered = await apiFetch<MediaAssetItem>('/v1/admin/media', {
    method: 'POST',
    body: JSON.stringify({
      kind,
      publicId: up.public_id,
      url: up.secure_url,
      mime: file.type || null,
      width: up.width || null,
      height: up.height || null,
      bytes: up.bytes || null,
      durationSec: up.duration ? Math.round(up.duration) : null,
      titleEn: title,
      altEn: title,
    }),
  });
  return registered.data;
}

export function MediaPicker({
  value,
  onChange,
  acceptKind = 'image',
  label = 'Media Asset',
}: {
  value?: string | null;
  onChange: (mediaId: string | null, asset?: MediaAssetItem) => void;
  acceptKind?: PickerKind;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [library, setLibrary] = React.useState<MediaAssetItem[]>([]);
  const [libPage, setLibPage] = React.useState(1);
  const [libTotal, setLibTotal] = React.useState(0);
  const [embedUrl, setEmbedUrl] = React.useState('');
  const [titleEn, setTitleEn] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [selected, setSelected] = React.useState<MediaAssetItem | null>(null);

  const loadLibrary = React.useCallback(async (page = 1) => {
    try {
      const res = await apiFetch<MediaAssetItem[]>(
        `/v1/admin/media?${LIST_KINDS[acceptKind] ? `kind=${LIST_KINDS[acceptKind]}&` : ''}page=${page}&limit=${PAGE_SIZE}`
      );
      setLibrary(res.data);
      setLibPage(page);
      setLibTotal(res.meta?.total ?? res.data.length);
      return res.data;
    } catch {
      // Ignored if media endpoint not yet populated
      return [];
    }
  }, [acceptKind]);

  React.useEffect(() => {
    if (open) {
      void loadLibrary();
    }
  }, [open, loadLibrary]);

  // Edit forms only know the saved media ID; fetch that one asset so the preview shows the actual image.
  React.useEffect(() => {
    if (!value) {
      setSelected(null);
    } else if (selected?.id !== value) {
      apiFetch<MediaAssetItem>(`/v1/admin/media/${value}`)
        .then((res) => setSelected(res.data))
        .catch(() => setSelected(null));
    }
  }, [value, selected?.id]);

  function pick(asset: MediaAssetItem) {
    setSelected(asset);
    onChange(asset.id, asset);
    setOpen(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      pick(await uploadMedia(file, acceptKind === 'any' ? kindOfFile(file) : acceptKind));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleEmbedSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await apiFetch<MediaAssetItem>('/v1/admin/media/embed', {
        method: 'POST',
        body: JSON.stringify({ url: embedUrl, titleEn: titleEn || undefined }),
      });
      pick(res.data);
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
        <div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-2 text-xs text-muted-foreground">
          {selected && (selected.thumbnailUrl || selected.kind === 'image') ? (
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded">
              <Image
                src={selected.thumbnailUrl ?? selected.url}
                alt={selected.altEn ?? ''}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          ) : null}
          <span className="line-clamp-2">
            {selected?.titleEn || selected?.altEn || `Selected media ID: ${value}`}
          </span>
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
                      onClick={() => pick(item)}
                      className="flex flex-col items-start gap-1 rounded border border-border p-2 text-left text-xs hover:border-primary"
                    >
                      {item.thumbnailUrl || item.kind === 'image' ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded">
                          <Image
                            src={item.thumbnailUrl ?? item.url}
                            alt=""
                            fill
                            sizes="(min-width: 640px) 25vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <span className="line-clamp-1 font-medium">
                        {item.titleEn || item.altEn || item.id.slice(0, 8)}
                      </span>
                      <span className="text-muted-foreground">{item.provider}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3">
                <Pager page={libPage} total={libTotal} onPage={(p) => void loadLibrary(p)} />
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <div className="space-y-2">
                <Label htmlFor={`upload-${acceptKind}`}>Choose a file to upload</Label>
                <Input
                  id={`upload-${acceptKind}`}
                  type="file"
                  accept={
                    acceptKind === 'any'
                      ? Object.values(UPLOAD_ACCEPT).join(',')
                      : UPLOAD_ACCEPT[acceptKind]
                  }
                  onChange={handleFileUpload}
                  disabled={busy}
                />
                <p className="text-xs text-muted-foreground">
                  {busy
                    ? 'Uploading…'
                    : acceptKind === 'image'
                      ? 'JPG, PNG, WebP, AVIF or SVG, max 10 MB. Landscape 16:9 (e.g. 1600×900) looks best as a cover.'
                      : acceptKind === 'video'
                        ? 'MP4 or WebM, max 25 MB.'
                        : 'PDF, max 15 MB.'}
                </p>
              </div>
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

