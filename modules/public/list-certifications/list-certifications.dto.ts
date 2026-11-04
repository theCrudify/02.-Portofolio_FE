import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const list_certifications_public_QuerySchema = createModuleQuerySchema({
  locale: flatQueryString.optional(),
  type: flatQueryString.optional(),
});

export type ListCertificationsPublicQueryDto = z.infer<typeof list_certifications_public_QuerySchema>;
export type ListCertificationsPublicPayloadDto = Record<string, unknown>;
