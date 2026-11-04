import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const delete_documents_QuerySchema = createModuleQuerySchema({

});

export type DeleteDocumentsQueryDto = z.infer<typeof delete_documents_QuerySchema>;
export type DeleteDocumentsPayloadDto = Record<string, unknown>;
