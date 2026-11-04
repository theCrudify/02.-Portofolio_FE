import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const list_documents_QuerySchema = createModuleQuerySchema({
  type: flatQueryString.optional(),
  locale: flatQueryString.optional(),
  isActive: flatQueryString.optional(),
});

export type ListDocumentsQueryDto = z.infer<typeof list_documents_QuerySchema>;
export type ListDocumentsPayloadDto = Record<string, unknown>;
