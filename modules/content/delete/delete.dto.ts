import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const delete_content_QuerySchema = createModuleQuerySchema({

});

export type DeleteContentQueryDto = z.infer<typeof delete_content_QuerySchema>;
export type DeleteContentPayloadDto = Record<string, unknown>;
