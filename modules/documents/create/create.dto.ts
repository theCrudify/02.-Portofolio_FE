import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const create_documents_QuerySchema = createModuleQuerySchema({

});

export type CreateDocumentsQueryDto = z.infer<typeof create_documents_QuerySchema>;
export type CreateDocumentsPayloadDto = Record<string, unknown>;
