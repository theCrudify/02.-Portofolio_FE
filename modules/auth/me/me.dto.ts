import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const me_auth_QuerySchema = createModuleQuerySchema({

});

export type MeAuthQueryDto = z.infer<typeof me_auth_QuerySchema>;
export type MeAuthPayloadDto = Record<string, unknown>;
