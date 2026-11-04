import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const logout_auth_QuerySchema = createModuleQuerySchema({

});

export type LogoutAuthQueryDto = z.infer<typeof logout_auth_QuerySchema>;
export type LogoutAuthPayloadDto = Record<string, unknown>;
