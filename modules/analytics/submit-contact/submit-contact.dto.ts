import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const submit_contact_analytics_QuerySchema = createModuleQuerySchema({

});

export type SubmitContactAnalyticsQueryDto = z.infer<typeof submit_contact_analytics_QuerySchema>;
export type SubmitContactAnalyticsPayloadDto = Record<string, unknown>;
