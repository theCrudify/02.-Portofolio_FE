'use client';

import * as React from 'react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { TableSearch } from '@/components/admin/data-table';
import { Pager } from '@/components/admin/pager';
import { useAdminList } from '@/lib/admin/use-admin-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'editor';
  totpEnabled: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const list = useAdminList<AdminUserRow>('/v1/admin/users');
  const { items: users, loading } = list;
  const [actionError, setError] = React.useState<string | null>(null);
  const error = actionError ?? list.error;
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<'owner' | 'editor'>('editor');

  const loadUsers = list.reload;

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch('/v1/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email, name, password, role }),
      });
      setEmail('');
      setName('');
      setPassword('');
      await loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create user.');
    }
  }

  async function handleToggleActive(u: AdminUserRow) {
    try {
      await apiFetch(`/v1/admin/users/${u.id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !u.isActive }),
      });
      await loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update user.');
    }
  }

  async function handleDeleteUser(id: string) {
    try {
      await apiFetch(`/v1/admin/users/${id}`, { method: 'DELETE' });
      await loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete user.');
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users & Roles</h1>
        <p className="text-sm text-muted-foreground">
          Manage owner and editor accounts with role-based permissions.
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

      <form
        onSubmit={handleCreateUser}
        className="grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-5"
      >
        <div>
          <Label htmlFor="user-name">Name</Label>
          <Input
            id="user-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="user-email">Email</Label>
          <Input
            id="user-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="user-password">Password (12+ chars)</Label>
          <Input
            id="user-password"
            type="password"
            minLength={12}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="user-role">Role</Label>
          <select
            id="user-role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'owner' | 'editor')}
            className="mt-1 flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="editor">Editor</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            Add User
          </Button>
        </div>
      </form>

      <TableSearch value={list.search} onChange={list.setSearch} placeholder="Search name or email…" />

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="w-14 px-4 py-3 text-right">No.</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">2FA</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  Loading users...
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-muted-foreground">
                    {list.offset + i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === 'owner' ? 'default' : 'secondary'}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3">{u.totpEnabled ? 'Enabled' : 'Disabled'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.isActive ? 'success' : 'warning'}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleToggleActive(u)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(u.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pager page={list.page} total={list.total} limit={list.limit} onPage={list.setPage} onLimit={list.setLimit} />
    </div>
  );
}

