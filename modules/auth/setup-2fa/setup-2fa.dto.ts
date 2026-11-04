import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const setup_2fa_auth_QuerySchema = createModuleQuerySchema({

});

export type Setup2faAuthQueryDto = z.infer<typeof setup_2fa_auth_QuerySchema>;
export type Setup2faAuthPayloadDto = Record<string, unknown>;
