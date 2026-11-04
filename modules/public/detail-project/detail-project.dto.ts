import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const detail_project_public_QuerySchema = createModuleQuerySchema({

});

export type DetailProjectPublicQueryDto = z.infer<typeof detail_project_public_QuerySchema>;
export type DetailProjectPublicPayloadDto = Record<string, unknown>;
