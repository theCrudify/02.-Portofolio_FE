'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { hasRole, type AdminRole, type AdminUser } from '@/lib/auth';

const UserContext = createContext<AdminUser | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: AdminUser | null;
  children: ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): AdminUser | null {
  return useContext(UserContext);
}

export interface RoleGateProps {
  minRole: AdminRole;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGate({ minRole, children, fallback = null }: RoleGateProps) {
  const user = useUser();
  if (!user || !hasRole(user.role, minRole)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}

