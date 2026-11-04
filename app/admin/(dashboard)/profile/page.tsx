'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BilingualField } from '@/components/admin/bilingual-field';
import { MediaPicker } from '@/components/admin/media-picker';

export default function AdminProfilePage() {
  const [fullName, setFullName] = React.useState('');
  const [headlineId, setHeadlineId] = React.useState('');
  const [headlineEn, setHeadlineEn] = React.useState('');
  const [shortBioId, setShortBioId] = React.useState('');
  const [shortBioEn, setShortBioEn] = React.useState('');
  const [longBioId, setLongBioId] = React.useState('');
  const [longBioEn, setLongBioEn] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [emailPublic, setEmailPublic] = React.useState('');
  const [avatarMediaId, setAvatarMediaId] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiFetch<Record<string, unknown>>('/v1/admin/profile')
      .then((res) => {
        if (!res.data) return;
        const p = res.data;
        setFullName(String(p.fullName ?? p.name ?? ''));
        setHeadlineId(String(p.headlineId ?? ''));
        setHeadlineEn(String(p.headlineEn ?? ''));
        setShortBioId(String(p.shortBioId ?? p.bioId ?? ''));
        setShortBioEn(String(p.shortBioEn ?? p.bioEn ?? ''));
        setLongBioId(String(p.longBioId ?? p.bioId ?? ''));
        setLongBioEn(String(p.longBioEn ?? p.bioEn ?? ''));
        setLocation(String(p.location ?? ''));
        setEmailPublic(String(p.emailPublic ?? p.email ?? ''));
        setAvatarMediaId((p.avatarMediaId as string | null) ?? null);
      })
      .catch(() => null);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);
    try {
      await apiFetch('/v1/admin/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullName,
          headlineId,
          headlineEn,
          shortBioId,
          shortBioEn,
          longBioId,
          longBioEn,
          location,
          emailPublic,
          avatarMediaId,
        }),
      });
      setStatusMsg('Profile saved and public site cache revalidated.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save profile.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update bilingual bio, headline, location, and public contact information.
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
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border border-border bg-card p-6"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="prof-name">Full Name</Label>
            <Input
              id="prof-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="prof-loc">Location</Label>
            <Input
              id="prof-loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="prof-email">Public Email</Label>
            <Input
              id="prof-email"
              type="email"
              value={emailPublic}
              onChange={(e) => setEmailPublic(e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </div>

        <BilingualField
          label="Headline"
          required
          valueId={headlineId}
          valueEn={headlineEn}
          onChangeId={setHeadlineId}
          onChangeEn={setHeadlineEn}
        />

        <BilingualField
          label="Short Bio"
          required
          multiline
          valueId={shortBioId}
          valueEn={shortBioEn}
          onChangeId={setShortBioId}
          onChangeEn={setShortBioEn}
        />

        <BilingualField
          label="Long Bio"
          required
          multiline
          valueId={longBioId}
          valueEn={longBioEn}
          onChangeId={setLongBioId}
          onChangeEn={setLongBioEn}
        />

        <MediaPicker
          label="Avatar Image"
          value={avatarMediaId}
          onChange={(id) => setAvatarMediaId(id)}
          acceptKind="image"
        />

        <div className="flex justify-end pt-2">
          <Button type="submit">Save Profile</Button>
        </div>
      </form>
    </div>
  );
}
