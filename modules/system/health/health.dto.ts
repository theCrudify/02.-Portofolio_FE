import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const health_system_QuerySchema = createModuleQuerySchema({

});

export type HealthSystemQueryDto = z.infer<typeof health_system_QuerySchema>;
export type HealthSystemPayloadDto = Record<string, unknown>;
