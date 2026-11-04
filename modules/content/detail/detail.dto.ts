import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const detail_content_QuerySchema = createModuleQuerySchema({

});

export type DetailContentQueryDto = z.infer<typeof detail_content_QuerySchema>;
export type DetailContentPayloadDto = Record<string, unknown>;
