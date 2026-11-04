'use client';

import * as React from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/client';
import { Badge } from '@/components/ui/badge';

interface DashboardSummary {
  counts: {
    projectsPublished: number;
    projectsDraft: number;
    unreadMessages: number;
  };
  expiringCertifications: { id: string; name?: string; nameEn?: string; expiryDate: string }[];
  recentAuditLogs: { id: string; action: string; resource: string; createdAt: string }[];
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);

  React.useEffect(() => {
    apiFetch<DashboardSummary>('/v1/admin/dashboard')
      .then((res) => setSummary(res.data))
      .catch(() => null);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Summary of published content, expiring certifications, and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-xs font-medium uppercase text-muted-foreground">
            Published Projects
          </div>
          <div className="mt-2 text-3xl font-bold">
            {summary?.counts.projectsPublished ?? 0}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-xs font-medium uppercase text-muted-foreground">Draft Projects</div>
          <div className="mt-2 text-3xl font-bold">{summary?.counts.projectsDraft ?? 0}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-xs font-medium uppercase text-muted-foreground">
            Unread Messages
          </div>
          <div className="mt-2 text-3xl font-bold">{summary?.counts.unreadMessages ?? 0}</div>
        </div>
      </div>

      {summary && summary.expiringCertifications.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Certifications Expiring in 30 Days</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {summary.expiringCertifications.map((cert) => (
              <li key={cert.id} className="flex items-center justify-between">
                <span>{cert.nameEn ?? cert.name}</span>
                <Badge variant="warning">Expires {cert.expiryDate}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Quick Links</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link
              href="/admin/projects/new"
              className="rounded-md border border-border px-3 py-1.5 hover:bg-muted"
            >
              + New Project
            </Link>
            <Link
              href="/admin/profile"
              className="rounded-md border border-border px-3 py-1.5 hover:bg-muted"
            >
              Edit Profile
            </Link>
            <Link
              href="/admin/media"
              className="rounded-md border border-border px-3 py-1.5 hover:bg-muted"
            >
              Media Library
            </Link>
            <Link
              href="/admin/documents"
              className="rounded-md border border-border px-3 py-1.5 hover:bg-muted"
            >
              CV & Share Links
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Recent Audit Activity</h2>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            {summary?.recentAuditLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between">
                <span>
                  <strong className="text-foreground">{log.action}</strong> on {log.resource}
                </span>
                <span>{new Date(log.createdAt).toLocaleDateString()}</span>
              </li>
            )) ?? <li>No recent logs.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

