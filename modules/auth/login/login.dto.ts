import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const login_auth_QuerySchema = createModuleQuerySchema({

});

export type LoginAuthQueryDto = z.infer<typeof login_auth_QuerySchema>;
export type LoginAuthPayloadDto = Record<string, unknown>;
