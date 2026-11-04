import { z } from 'zod';
import { createModuleQuerySchema, flatQueryString } from '@/core/query';

export const import_backup_system_QuerySchema = createModuleQuerySchema({

});

export type ImportBackupSystemQueryDto = z.infer<typeof import_backup_system_QuerySchema>;
export type ImportBackupSystemPayloadDto = Record<string, unknown>;
