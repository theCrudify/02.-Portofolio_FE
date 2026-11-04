import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const list_media_QuerySchema = createModuleQuerySchema({
  kind: flatQueryString.optional(),
  provider: flatQueryString.optional(),
  includeDeleted: flatQueryString.optional(),
});

export type ListMediaQueryDto = z.infer<typeof list_media_QuerySchema>;
export type ListMediaPayloadDto = Record<string, unknown>;
