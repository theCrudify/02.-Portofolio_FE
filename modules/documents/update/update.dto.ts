import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const update_documents_QuerySchema = createModuleQuerySchema({

});

export type UpdateDocumentsQueryDto = z.infer<typeof update_documents_QuerySchema>;
export type UpdateDocumentsPayloadDto = Record<string, unknown>;
