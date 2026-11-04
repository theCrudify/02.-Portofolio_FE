import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const create_media_QuerySchema = createModuleQuerySchema({

});

export type CreateMediaQueryDto = z.infer<typeof create_media_QuerySchema>;
export type CreateMediaPayloadDto = Record<string, unknown>;
