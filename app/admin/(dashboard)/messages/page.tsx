'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  locale: 'en' | 'id';
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = React.useState<ContactMessageRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const loadMessages = React.useCallback(async () => {
    try {
      const res = await apiFetch<ContactMessageRow[]>('/v1/admin/messages');
      setMessages(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load messages.');
    }
  }, []);

  React.useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  async function handlePatch(id: string, patch: { isRead?: boolean; isArchived?: boolean }) {
    try {
      await apiFetch(`/v1/admin/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
      await loadMessages();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update message.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inbox Messages</h1>
        <p className="text-sm text-muted-foreground">
          Messages submitted through the public contact form.
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

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No messages received yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{msg.name}</span>
                  <span className="text-xs text-muted-foreground">&lt;{msg.email}&gt;</span>
                  {!msg.isRead && <Badge variant="default">Unread</Badge>}
                  {msg.isArchived && <Badge variant="secondary">Archived</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePatch(msg.id, { isRead: !msg.isRead })}
                  >
                    {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePatch(msg.id, { isArchived: !msg.isArchived })}
                  >
                    {msg.isArchived ? 'Unarchive' : 'Archive'}
                  </Button>
                </div>
              </div>
              {msg.subject && (
                <div className="mt-2 text-sm font-medium text-foreground">{msg.subject}</div>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{msg.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
