import { BaseFrontendService } from '@/core/base';
import type { ImportBackupSystemPayloadDto, ImportBackupSystemQueryDto } from './import-backup.dto';
import { ImportBackupSystemRepository } from './import-backup.repository';

export class ImportBackupSystemService extends BaseFrontendService<ImportBackupSystemRepository> {
  constructor(repo = new ImportBackupSystemRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: ImportBackupSystemPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const importbackupSystemService = new ImportBackupSystemService();
