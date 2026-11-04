import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const detail_media_QuerySchema = createModuleQuerySchema({

});

export type DetailMediaQueryDto = z.infer<typeof detail_media_QuerySchema>;
export type DetailMediaPayloadDto = Record<string, unknown>;
