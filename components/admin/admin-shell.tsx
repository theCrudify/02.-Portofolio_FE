'use client';

import {
  BarChart3,
  Briefcase,
  FileText,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Palette,
  Settings,
  UserCircle,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { UserProvider } from '@/components/admin/role-gate';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
import { hasRole, type AdminRole, type AdminUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

export interface AdminShellProps {
  user: AdminUser;
  children: ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  minRole: AdminRole;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, minRole: 'viewer' },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, minRole: 'viewer' },
  { href: '/admin/messages', label: 'Messages', icon: Mail, minRole: 'viewer' },
  { href: '/admin/profile', label: 'Profile', icon: UserCircle, minRole: 'editor' },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban, minRole: 'editor' },
  { href: '/admin/technologies', label: 'Technologies', icon: Wrench, minRole: 'editor' },
  { href: '/admin/content/experiences', label: 'Content', icon: Briefcase, minRole: 'editor' },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon, minRole: 'editor' },
  { href: '/admin/documents', label: 'CV & Share Links', icon: FileText, minRole: 'editor' },
  { href: '/admin/appearance', label: 'Appearance', icon: Palette, minRole: 'owner' },
  { href: '/admin/seo', label: 'SEO Global', icon: Globe, minRole: 'owner' },
  { href: '/admin/users', label: 'Users', icon: Users, minRole: 'owner' },
  { href: '/admin/settings', label: 'Settings & Backup', icon: Settings, minRole: 'viewer' },
];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleItems = ADMIN_NAV_ITEMS.filter((item) =>
    hasRole(user.role, item.minRole),
  );

  const handleLogout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.replace('/admin/login');
  };

  return (
    <UserProvider user={user}>
      <div className="flex min-h-screen bg-muted/30 text-foreground">
        <aside
          aria-label="Admin sidebar"
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform md:static md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Link href="/admin" className="font-heading text-lg font-bold">
              Portfolio Admin
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-sm md:px-6">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open sidebar"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link
                href="/"
                target="_blank"
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                View Public Site ↗
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
