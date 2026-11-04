import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const list_projects_public_QuerySchema = createModuleQuerySchema({
  locale: flatQueryString.optional(),
  technology: flatQueryString.optional(),
  type: flatQueryString.optional(),
  featured: flatQueryString.optional(),
});

export type ListProjectsPublicQueryDto = z.infer<typeof list_projects_public_QuerySchema>;
export type ListProjectsPublicPayloadDto = Record<string, unknown>;
