import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const update_message_analytics_QuerySchema = createModuleQuerySchema({

});

export type UpdateMessageAnalyticsQueryDto = z.infer<typeof update_message_analytics_QuerySchema>;
export type UpdateMessageAnalyticsPayloadDto = Record<string, unknown>;
