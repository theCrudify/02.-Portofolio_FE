import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const update_content_QuerySchema = createModuleQuerySchema({

});

export type UpdateContentQueryDto = z.infer<typeof update_content_QuerySchema>;
export type UpdateContentPayloadDto = Record<string, unknown>;
