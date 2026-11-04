import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const enable_2fa_auth_QuerySchema = createModuleQuerySchema({

});

export type Enable2faAuthQueryDto = z.infer<typeof enable_2fa_auth_QuerySchema>;
export type Enable2faAuthPayloadDto = Record<string, unknown>;
