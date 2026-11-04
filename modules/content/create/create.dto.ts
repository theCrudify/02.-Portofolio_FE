import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const create_content_QuerySchema = createModuleQuerySchema({

});

export type CreateContentQueryDto = z.infer<typeof create_content_QuerySchema>;
export type CreateContentPayloadDto = Record<string, unknown>;
