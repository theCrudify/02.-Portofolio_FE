import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const embed_media_QuerySchema = createModuleQuerySchema({

});

export type EmbedMediaQueryDto = z.infer<typeof embed_media_QuerySchema>;
export type EmbedMediaPayloadDto = Record<string, unknown>;
