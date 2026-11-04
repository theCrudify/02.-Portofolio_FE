import { cookies } from 'next/headers';
import { cache } from 'react';
import { apiGet } from '@/lib/api/server';

export type AdminRole = 'owner' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  totpEnabled: boolean;
  mustEnable2fa?: boolean;
}

const ROLE_WEIGHT: Record<AdminRole, number> = {
  viewer: 1,
  editor: 2,
  owner: 3,
};

export function hasRole(userRole: AdminRole | undefined, minRole: AdminRole): boolean {
  if (!userRole) return false;
  return ROLE_WEIGHT[userRole] >= ROLE_WEIGHT[minRole];
}

export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('pf_session');
    if (!session?.value) {
      return null;
    }

    const res = await apiGet<AdminUser>('/auth/me', {
      cookieHeader: `pf_session=${session.value}`,
      revalidate: 0,
    });
    return res.data;
  } catch {
    return null;
  }
});

