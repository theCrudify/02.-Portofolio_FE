import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const verify_2fa_auth_QuerySchema = createModuleQuerySchema({

});

export type Verify2faAuthQueryDto = z.infer<typeof verify_2fa_auth_QuerySchema>;
export type Verify2faAuthPayloadDto = Record<string, unknown>;
