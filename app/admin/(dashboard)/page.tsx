'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Download,
  Eye,
  FileEdit,
  FolderCheck,
  Mail,
  Users,
} from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { useUser } from '@/components/admin/role-gate';
import { ViewsChart } from '@/components/admin/views-chart';
import { StatCard } from '@/components/admin/stat-card';
import { BreakdownList } from '@/components/admin/breakdown-list';
import { ADMIN_RESOURCES, type AdminResourceKey } from '@/lib/admin/resources';
import { countryName, pathsAsItems, type AnalyticsPayload } from '@/lib/admin/analytics';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardSummary {
  counts: {
    projectsPublished: number;
    projectsDraft: number;
    unreadMessages: number;
  };
  expiringCertifications: { id: string; name?: string; nameEn?: string; expiryDate: string }[];
  recentAuditLogs: {
    id: string;
    action: string;
    resource: string;
    summary: string | null;
    createdAt: string;
  }[];
  content?: { resource: string; published: number; draft: number; archived: number }[];
}

interface MessageRow {
  id: string;
  name: string;
  subject: string | null;
  body: string;
  createdAt: string;
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** "3 hours ago", "yesterday", … */
function timeAgo(iso: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return 'just now';
}

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

function greeting() {
  const h = new Date().getHours();
  return h < 11 ? 'Good morning' : h < 15 ? 'Good afternoon' : h < 19 ? 'Good evening' : 'Good night';
}

function Panel({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{title}</h2>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {linkLabel} <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function AdminDashboardPage() {
  const user = useUser();
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = React.useState<AnalyticsPayload | null>(null);
  const [messages, setMessages] = React.useState<MessageRow[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    // Each panel degrades on its own; only the core summary failing is reported.
    Promise.allSettled([
      apiFetch<DashboardSummary>('/v1/admin/dashboard').then((r) => setSummary(r.data)),
      apiFetch<AnalyticsPayload>('/v1/admin/analytics?range=7d').then((r) => setAnalytics(r.data)),
      apiFetch<MessageRow[]>('/v1/admin/messages?page=1&limit=5&isRead=false').then((r) =>
        setMessages(r.data),
      ),
    ]).then(([core]) => {
      setFailed(core.status === 'rejected');
      setLoading(false);
    });
  }, []);

  const counts = summary?.counts;
  const t = analytics?.totals;
  const prev = analytics?.previous;
  const todo = [
    counts?.unreadMessages
      ? { text: `${counts.unreadMessages} unread message(s) waiting for a reply`, href: '/admin/messages' }
      : null,
    ...(summary?.content ?? [])
      .filter((c) => c.draft > 0)
      .map((c) => ({
        text: `${c.draft} ${ADMIN_RESOURCES[c.resource as AdminResourceKey]?.title ?? c.resource} draft(s) not yet published`,
        href: `/admin/content/${c.resource}`,
      })),
    ...(summary?.expiringCertifications ?? []).map((c) => ({
      text: `${c.nameEn ?? c.name} expires in ${daysUntil(c.expiryDate)} day(s) (${c.expiryDate})`,
      href: '/admin/content/certifications',
    })),
  ].filter((t): t is { text: string; href: string } => t !== null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting()}
          {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here is how your portfolio is doing and what needs your attention.
        </p>
      </div>

      {failed && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          Could not load the dashboard summary. Refresh the page or check that the API is running.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Views" value={t?.views ?? 0} previous={prev?.views} previousLabel="vs prev. 7d" icon={Eye} href="/admin/analytics" loading={loading} />
        <StatCard label="Visitors" value={t?.visitors ?? 0} previous={prev?.visitors} previousLabel="vs prev. 7d" icon={Users} href="/admin/analytics" loading={loading} />
        <StatCard label="CV Downloads" value={t?.cvDownloads ?? 0} previous={prev?.cvDownloads} previousLabel="vs prev. 7d" icon={Download} href="/admin/analytics" loading={loading} />
        <StatCard label="Unread" value={counts?.unreadMessages ?? 0} subtext="Inbox messages" icon={Mail} href="/admin/messages" loading={loading} />
        <StatCard label="Published" value={counts?.projectsPublished ?? 0} subtext="Live projects" icon={FolderCheck} href="/admin/content/projects" loading={loading} />
        <StatCard label="Drafts" value={counts?.projectsDraft ?? 0} subtext="Projects in draft" icon={FileEdit} href="/admin/content/projects" loading={loading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? <Skeleton className="h-64 w-full" /> : <ViewsChart title="Last 7 Days" series={analytics?.series ?? []} />}
        </div>

        <Panel title="Needs Attention">
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : todo.length === 0 ? (
            <p className="text-sm text-muted-foreground">All caught up. Nothing needs action right now.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {todo.map((t) => (
                <li key={t.text}>
                  <Link href={t.href} className="flex items-start gap-2 rounded-md p-2 hover:bg-muted">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <span>{t.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {analytics && (
        <div className="grid gap-4 md:grid-cols-3">
          <BreakdownList title="Top Pages · 7 days" items={pathsAsItems(analytics.topPaths)} limit={5} />
          <BreakdownList title="Traffic Sources · 7 days" items={analytics.referrers} limit={5} />
          <BreakdownList title="Countries · 7 days" items={analytics.countries} formatKey={countryName} limit={5} />
        </div>
      )}

      {summary?.content && (
        <Panel title="Content Overview">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Section</th>
                  <th className="px-3 py-2 text-right font-medium">Published</th>
                  <th className="px-3 py-2 text-right font-medium">Draft</th>
                  <th className="px-3 py-2 text-right font-medium">Archived</th>
                  <th className="py-2 pl-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {summary.content.map((c) => {
                  const meta = ADMIN_RESOURCES[c.resource as AdminResourceKey];
                  const total = c.published + c.draft + c.archived;
                  return (
                    <tr key={c.resource}>
                      <td className="py-2 pr-3">
                        <Link href={`/admin/content/${c.resource}`} className="font-medium hover:text-primary hover:underline">
                          {meta?.title ?? c.resource}
                        </Link>
                        {total === 0 && <span className="ml-2 text-xs text-warning">empty</span>}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{c.published}</td>
                      <td className={`px-3 py-2 text-right tabular-nums ${c.draft ? 'font-semibold text-warning' : 'text-muted-foreground'}`}>{c.draft}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{c.archived}</td>
                      <td className="py-2 pl-3 text-right font-medium tabular-nums">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Latest Unread Messages" href="/admin/messages" linkLabel="Open inbox">
          {messages === null ? (
            loading ? <Skeleton className="h-24 w-full" /> : <p className="text-sm text-muted-foreground">Messages unavailable.</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No unread messages.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {messages.map((m) => (
                <li key={m.id} className="py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{m.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(m.createdAt)}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{m.subject || m.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Activity">
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : !summary?.recentAuditLogs.length ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {summary.recentAuditLogs.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <Badge variant="secondary" className="shrink-0 capitalize">{log.action}</Badge>
                    <span className="truncate text-muted-foreground">{log.summary || log.resource}</span>
                  </span>
                  <span
                    className="shrink-0 text-xs text-muted-foreground"
                    title={new Date(log.createdAt).toLocaleString()}
                  >
                    {timeAgo(log.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
