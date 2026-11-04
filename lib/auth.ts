import { cookies } from "next/headers";
import { cache } from "react";
import { apiGet } from "@/lib/api/server";

import type { AdminUser } from "@/lib/roles";

export { hasRole, type AdminRole, type AdminUser } from "@/lib/roles";

export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("pf_session");
    if (!session?.value) {
      return null;
    }

    const res = await apiGet<AdminUser>("/auth/me", {
      cookieHeader: `pf_session=${session.value}`,
      revalidate: 0,
    });
    return res.data;
  } catch {
    return null;
  }
});
