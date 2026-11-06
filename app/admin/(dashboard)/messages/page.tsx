'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableSearch } from '@/components/admin/data-table';
import { Pager } from '@/components/admin/pager';
import { useAdminList } from '@/lib/admin/use-admin-list';
import { toast } from 'sonner';

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
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'archived'>('all');
  const list = useAdminList<ContactMessageRow>('/v1/admin/messages', {
    isRead: filter === 'unread' ? false : undefined,
    isArchived: filter === 'archived' ? true : undefined,
  });
  const error = list.error;

  async function handlePatch(id: string, patch: { isRead?: boolean; isArchived?: boolean }) {
    try {
      await apiFetch(`/v1/admin/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
      toast.success(
        patch.isArchived !== undefined
          ? patch.isArchived ? 'Message archived.' : 'Message moved back to the inbox.'
          : patch.isRead ? 'Marked as read.' : 'Marked as unread.',
      );
      await list.reload();
    } catch (err) {
      toast.error('Could not update the message.', { description: err instanceof ApiError ? err.message : undefined });
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex w-fit rounded-lg border border-border bg-muted p-1 text-xs" role="tablist">
          {(['all', 'unread', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={filter === tab}
              onClick={() => setFilter(tab)}
              className={`rounded-md px-3 py-1.5 font-medium capitalize transition-colors ${
                filter === tab ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <TableSearch value={list.search} onChange={list.setSearch} placeholder="Search name, email, subject…" />
      </div>

      <div className={`space-y-3 ${list.loading && list.items.length > 0 ? 'opacity-60' : ''}`}>
        {!list.loading && list.items.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            {list.search || filter !== 'all' ? 'No messages match this search.' : 'No messages received yet.'}
          </div>
        ) : (
          list.items.map((msg, i) => (
            <div key={msg.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    #{list.offset + i + 1}
                  </span>
                  <span className="font-semibold text-foreground">{msg.name}</span>
                  <span className="text-xs text-muted-foreground">&lt;{msg.email}&gt;</span>
                  {!msg.isRead && <Badge variant="default">Unread</Badge>}
                  {msg.isArchived && <Badge variant="secondary">Archived</Badge>}
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
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
      <Pager page={list.page} total={list.total} limit={list.limit} onPage={list.setPage} onLimit={list.setLimit} />
    </div>
  );
}

