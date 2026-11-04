import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const list_audit_logs_system_QuerySchema = createModuleQuerySchema({
  action: flatQueryString.optional(),
  resource: flatQueryString.optional(),
  userId: flatQueryString.optional(),
});

export type ListAuditLogsSystemQueryDto = z.infer<typeof list_audit_logs_system_QuerySchema>;
export type ListAuditLogsSystemPayloadDto = Record<string, unknown>;
