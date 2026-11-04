import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const list_users_QuerySchema = createModuleQuerySchema({
  role: flatQueryString.optional(),
  isActive: flatQueryString.optional(),
});

export type ListUsersQueryDto = z.infer<typeof list_users_QuerySchema>;
export type ListUsersPayloadDto = Record<string, unknown>;
