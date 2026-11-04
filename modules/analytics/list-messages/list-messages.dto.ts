import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const list_messages_analytics_QuerySchema = createModuleQuerySchema({
  isRead: flatQueryString.optional(),
  isArchived: flatQueryString.optional(),
  locale: flatQueryString.optional(),
});

export type ListMessagesAnalyticsQueryDto = z.infer<typeof list_messages_analytics_QuerySchema>;
export type ListMessagesAnalyticsPayloadDto = Record<string, unknown>;
