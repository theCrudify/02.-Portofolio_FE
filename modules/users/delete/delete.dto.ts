import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const delete_users_QuerySchema = createModuleQuerySchema({

});

export type DeleteUsersQueryDto = z.infer<typeof delete_users_QuerySchema>;
export type DeleteUsersPayloadDto = Record<string, unknown>;
