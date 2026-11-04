import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const list_content_QuerySchema = createModuleQuerySchema({
  status: flatQueryString.optional(),
  featured: flatQueryString.optional(),
  category: flatQueryString.optional(),
  type: flatQueryString.optional(),
  includeDeleted: flatQueryString.optional(),
});

export type ListContentQueryDto = z.infer<typeof list_content_QuerySchema>;
export type ListContentPayloadDto = Record<string, unknown>;
