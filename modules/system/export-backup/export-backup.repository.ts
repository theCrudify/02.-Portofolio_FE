import { BaseFrontendRepository } from '@/core/base';
import type { ExportBackupSystemPayloadDto, ExportBackupSystemQueryDto } from './export-backup.dto';

export class ExportBackupSystemRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.get<T>('/v1/admin/backup/export', query);
  }

}
