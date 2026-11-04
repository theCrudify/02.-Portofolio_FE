import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const update_media_QuerySchema = createModuleQuerySchema({

});

export type UpdateMediaQueryDto = z.infer<typeof update_media_QuerySchema>;
export type UpdateMediaPayloadDto = Record<string, unknown>;
