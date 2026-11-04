import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const delete_media_QuerySchema = createModuleQuerySchema({

});

export type DeleteMediaQueryDto = z.infer<typeof delete_media_QuerySchema>;
export type DeleteMediaPayloadDto = Record<string, unknown>;
