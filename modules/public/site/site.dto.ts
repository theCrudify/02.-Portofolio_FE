import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const site_public_QuerySchema = createModuleQuerySchema({

});

export type SitePublicQueryDto = z.infer<typeof site_public_QuerySchema>;
export type SitePublicPayloadDto = Record<string, unknown>;
