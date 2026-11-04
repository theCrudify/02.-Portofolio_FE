import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const change_password_auth_QuerySchema = createModuleQuerySchema({

});

export type ChangePasswordAuthQueryDto = z.infer<typeof change_password_auth_QuerySchema>;
export type ChangePasswordAuthPayloadDto = Record<string, unknown>;
