import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const sign_media_QuerySchema = createModuleQuerySchema({

});

export type SignMediaQueryDto = z.infer<typeof sign_media_QuerySchema>;
export type SignMediaPayloadDto = Record<string, unknown>;
