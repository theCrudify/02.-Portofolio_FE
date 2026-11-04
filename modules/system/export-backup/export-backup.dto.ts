import { z } from 'zod';
import { createModuleQuerySchema } from '@/core/query';

export const export_backup_system_QuerySchema = createModuleQuerySchema({

});

export type ExportBackupSystemQueryDto = z.infer<typeof export_backup_system_QuerySchema>;
export type ExportBackupSystemPayloadDto = Record<string, unknown>;
