// Client-safe: no next/headers here, so client components can import it.
export type AdminRole = "owner" | "editor" | "viewer";

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

export function hasRole(
  userRole: AdminRole | undefined,
  minRole: AdminRole,
): boolean {
  if (!userRole) return false;
  return ROLE_WEIGHT[userRole] >= ROLE_WEIGHT[minRole];
}
