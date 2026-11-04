import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const summary_analytics_QuerySchema = createModuleQuerySchema({

});

export type SummaryAnalyticsQueryDto = z.infer<typeof summary_analytics_QuerySchema>;
export type SummaryAnalyticsPayloadDto = Record<string, unknown>;
