import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const disable_2fa_auth_QuerySchema = createModuleQuerySchema({

});

export type Disable2faAuthQueryDto = z.infer<typeof disable_2fa_auth_QuerySchema>;
export type Disable2faAuthPayloadDto = Record<string, unknown>;
