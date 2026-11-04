import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const create_users_QuerySchema = createModuleQuerySchema({

});

export type CreateUsersQueryDto = z.infer<typeof create_users_QuerySchema>;
export type CreateUsersPayloadDto = Record<string, unknown>;
