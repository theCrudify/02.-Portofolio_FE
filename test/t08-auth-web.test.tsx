import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoleGate, UserProvider } from '@/components/admin/role-gate';
import { AdminShell } from '@/components/admin/admin-shell';

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

describe('T08 Auth & Role Web Components', () => {
  it('RoleGate renders children for allowed role and fallback for disallowed role', () => {
    const { rerender } = render(
      <UserProvider
        user={{
          id: '2',
          email: 'editor@example.com',
          name: 'Editor User',
          role: 'editor',
          totpEnabled: false,
        }}
      >
        <RoleGate minRole="owner" fallback={<span>Restricted</span>}>
          <span>Owner Secret</span>
        </RoleGate>
      </UserProvider>
    );
    expect(screen.queryByText('Owner Secret')).toBeNull();
    expect(screen.getByText('Restricted')).toBeTruthy();

    rerender(
      <UserProvider
        user={{
          id: '1',
          email: 'owner@example.com',
          name: 'Owner User',
          role: 'owner',
          totpEnabled: true,
        }}
      >
        <RoleGate minRole="owner" fallback={<span>Restricted</span>}>
          <span>Owner Secret</span>
        </RoleGate>
      </UserProvider>
    );
    expect(screen.getByText('Owner Secret')).toBeTruthy();
  });

  it('AdminShell hides owner-only navigation items when user is editor', () => {
    const { rerender } = render(
      <AdminShell
        user={{
          id: '2',
          email: 'editor@example.com',
          name: 'Editor User',
          role: 'editor',
          totpEnabled: false,
        }}
      >
        <div>Dashboard Content</div>
      </AdminShell>
    );
    expect(screen.getByText('Projects')).toBeTruthy();
    expect(screen.queryByText('Users')).toBeNull();
    expect(screen.queryByText('Appearance')).toBeNull();

    rerender(
      <AdminShell
        user={{
          id: '1',
          email: 'owner@example.com',
          name: 'Owner User',
          role: 'owner',
          totpEnabled: true,
        }}
      >
        <div>Dashboard Content</div>
      </AdminShell>
    );
    expect(screen.getByText('Users')).toBeTruthy();
    expect(screen.getByText('Appearance')).toBeTruthy();
  });
});
