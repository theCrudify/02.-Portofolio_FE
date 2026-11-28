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
  type LucideIcon,
} from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { useUser } from '@/components/admin/role-gate';
import { ViewsChart, type DailySeriesPoint } from '@/components/admin/views-chart';
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
}

interface AnalyticsSummary {
  totals: { views: number; uniqueVisitors: number; cvDownloads: number; contactSubmissions: number };
  series: DailySeriesPoint[];
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

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  href,
  loading,
}: {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  href: string;
  loading: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
        <Icon className="h-4 w-4 group-hover:text-primary" />
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-16" />
      ) : (
        <div className="mt-2 font-mono text-3xl font-bold">{value.toLocaleString()}</div>
      )}
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </Link>
  );
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
  const [analytics, setAnalytics] = React.useState<AnalyticsSummary | null>(null);
  const [messages, setMessages] = React.useState<MessageRow[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    // Each panel degrades on its own; only the core summary failing is reported.
    Promise.allSettled([
      apiFetch<DashboardSummary>('/v1/admin/dashboard').then((r) => setSummary(r.data)),
      apiFetch<AnalyticsSummary>('/v1/admin/analytics?range=7d').then((r) => setAnalytics(r.data)),
      apiFetch<MessageRow[]>('/v1/admin/messages?page=1&limit=5&isRead=false').then((r) =>
        setMessages(r.data),
      ),
    ]).then(([core]) => {
      setFailed(core.status === 'rejected');
      setLoading(false);
    });
  }, []);

  const counts = summary?.counts;
  const todo = [
    counts?.unreadMessages
      ? { text: `${counts.unreadMessages} unread message(s) waiting for a reply`, href: '/admin/messages' }
      : null,
    counts?.projectsDraft
      ? { text: `${counts.projectsDraft} project draft(s) not yet published`, href: '/admin/content/projects' }
      : null,
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
        <Stat label="Views" value={analytics?.totals.views ?? 0} hint="Last 7 days" icon={Eye} href="/admin/analytics" loading={loading} />
        <Stat label="Visitors" value={analytics?.totals.uniqueVisitors ?? 0} hint="Unique, last 7 days" icon={Users} href="/admin/analytics" loading={loading} />
        <Stat label="CV Downloads" value={analytics?.totals.cvDownloads ?? 0} hint="Last 7 days" icon={Download} href="/admin/documents" loading={loading} />
        <Stat label="Unread" value={counts?.unreadMessages ?? 0} hint="Inbox messages" icon={Mail} href="/admin/messages" loading={loading} />
        <Stat label="Published" value={counts?.projectsPublished ?? 0} hint="Live projects" icon={FolderCheck} href="/admin/content/projects" loading={loading} />
        <Stat label="Drafts" value={counts?.projectsDraft ?? 0} hint="Projects in draft" icon={FileEdit} href="/admin/content/projects" loading={loading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? <Skeleton className="h-64 w-full" /> : <ViewsChart series={analytics?.series ?? []} />}
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
