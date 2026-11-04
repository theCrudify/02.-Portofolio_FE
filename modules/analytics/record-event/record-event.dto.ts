import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const record_event_analytics_QuerySchema = createModuleQuerySchema({

});

export type RecordEventAnalyticsQueryDto = z.infer<typeof record_event_analytics_QuerySchema>;
export type RecordEventAnalyticsPayloadDto = Record<string, unknown>;
