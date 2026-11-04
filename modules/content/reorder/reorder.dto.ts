import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const reorder_content_QuerySchema = createModuleQuerySchema({

});

export type ReorderContentQueryDto = z.infer<typeof reorder_content_QuerySchema>;
export type ReorderContentPayloadDto = Record<string, unknown>;
