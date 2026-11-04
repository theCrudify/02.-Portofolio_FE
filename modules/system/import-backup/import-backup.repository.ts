import { BaseFrontendRepository } from '@/core/base';
import type { ImportBackupSystemPayloadDto } from './import-backup.dto';

export class ImportBackupSystemRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: ImportBackupSystemPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/admin/backup/import', payload, query);
  }

}
