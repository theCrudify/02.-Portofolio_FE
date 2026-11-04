import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const update_users_QuerySchema = createModuleQuerySchema({

});

export type UpdateUsersQueryDto = z.infer<typeof update_users_QuerySchema>;
export type UpdateUsersPayloadDto = Record<string, unknown>;
