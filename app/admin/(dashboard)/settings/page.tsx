'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PAGE_SIZE, Pager } from '@/components/admin/pager';
import { useConfirm } from '@/components/admin/confirm-dialog';
import { toast } from 'sonner';

interface AuditLogEntry {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  summary: string | null;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [totpSetup, setTotpSetup] = React.useState<{ secret: string; otpauthUrl: string } | null>(
    null
  );
  const [totpCode, setTotpCode] = React.useState('');
  const [disablePassword, setDisablePassword] = React.useState('');
  const [disableCode, setDisableCode] = React.useState('');
  // Outcomes are reported as toasts; null clears nothing.
  const setStatusMessage = (message: string | null) => message && toast.success(message);
  const setError = (message: string | null) => message && toast.error(message);
  const confirm = useConfirm();
  const [auditLogs, setAuditLogs] = React.useState<AuditLogEntry[]>([]);
  const [auditPage, setAuditPage] = React.useState(1);
  const [auditTotal, setAuditTotal] = React.useState(0);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatusMessage(null);
    try {
      await apiFetch('/v1/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword('');
      setNewPassword('');
      setStatusMessage('Password updated and all other sessions invalidated.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to change password.');
    }
  }

  async function handleSetup2fa() {
    setError(null);
    try {
      const res = await apiFetch<{ secret: string; otpauthUrl: string }>('/v1/auth/2fa/setup', {
        method: 'POST',
      });
      setTotpSetup(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to start 2FA setup.');
    }
  }

  async function handleEnable2fa(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch('/v1/auth/2fa/enable', {
        method: 'POST',
        body: JSON.stringify({ code: totpCode }),
      });
      setTotpSetup(null);
      setTotpCode('');
      setStatusMessage('Two-factor authentication enabled.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid TOTP code.');
    }
  }

  async function handleDisable2fa(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch('/v1/auth/2fa/disable', {
        method: 'POST',
        body: JSON.stringify({ password: disablePassword, code: disableCode }),
      });
      setDisablePassword('');
      setDisableCode('');
      setStatusMessage('Two-factor authentication disabled.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to disable 2FA.');
    }
  }

  async function handleLogoutAll() {
    const ok = await confirm({
      tone: 'warning',
      title: 'Sign out everywhere?',
      description: 'Every session on every device is ended, including this one. You will need to log in again.',
      confirmLabel: 'Sign out all',
    });
    if (!ok) return;
    try {
      await apiFetch('/v1/auth/logout-all', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to logout all sessions.');
    }
  }

  async function loadAuditLogs(page = 1) {
    try {
      const res = await apiFetch<AuditLogEntry[]>(
        `/v1/admin/audit-logs?page=${page}&limit=${PAGE_SIZE}`
      );
      setAuditLogs(res.data);
      setAuditPage(page);
      setAuditTotal(res.meta?.total ?? res.data.length);
    } catch {
      // Handled when T13 endpoint is mounted
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings & Security</h1>
        <p className="text-sm text-muted-foreground">
          Manage account security, 2FA TOTP, backups, and audit logs.
        </p>
      </div>


      <Tabs defaultValue="security">
        <TabsList>
          <TabsTrigger value="security">Security & 2FA</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="audit" onClick={() => void loadAuditLogs()}>
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <form
            onSubmit={handlePasswordChange}
            className="max-w-md space-y-4 rounded-lg border border-border bg-card p-5"
          >
            <h2 className="text-lg font-semibold">Change Password</h2>
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password (min 12 chars)</Label>
              <Input
                id="new-password"
                type="password"
                minLength={12}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button type="submit">Update Password</Button>
          </form>

          <div className="max-w-md space-y-4 rounded-lg border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Two-Factor Authentication (TOTP)</h2>
            {!totpSetup ? (
              <Button type="button" onClick={handleSetup2fa}>
                Generate 2FA Secret
              </Button>
            ) : (
              <form onSubmit={handleEnable2fa} className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Secret: <code className="font-mono text-foreground">{totpSetup.secret}</code>
                </p>
                <p className="break-all text-xs text-muted-foreground">{totpSetup.otpauthUrl}</p>
                <div>
                  <Label htmlFor="enable-totp-code">Enter 6-digit code to activate</Label>
                  <Input
                    id="enable-totp-code"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit">Verify & Enable 2FA</Button>
              </form>
            )}

            <form onSubmit={handleDisable2fa} className="space-y-3 border-t border-border pt-4">
              <h3 className="text-sm font-medium">Disable 2FA</h3>
              <Input
                type="password"
                placeholder="Current password"
                required
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
              />
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit TOTP code"
                required
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value)}
              />
              <Button type="submit" variant="outline" size="sm">
                Disable 2FA
              </Button>
            </form>
          </div>

          <div className="max-w-md rounded-lg border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Active Sessions</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Revoke all active refresh tokens across all devices.
            </p>
            <Button variant="destructive" className="mt-3" onClick={handleLogoutAll}>
              Logout All Devices
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="max-w-lg space-y-3 rounded-lg border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">JSON Content Backup</h2>
            <p className="text-sm text-muted-foreground">
              Export all portfolio tables as a portable JSON bundle or test restoring with dry-run.
            </p>
            <Button
              type="button"
              onClick={async () => {
                const res = await apiFetch<Record<string, unknown>>('/v1/admin/backup/export');
                const blob = new Blob([JSON.stringify(res.data, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
              }}
            >
              Download JSON Backup
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Summary</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 font-medium">{log.action}</td>
                    <td className="px-4 py-3">{log.resource}</td>
                    <td className="px-4 py-3 text-xs">{log.summary ?? log.resourceId ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{log.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={auditPage} total={auditTotal} onPage={(p) => void loadAuditLogs(p)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

