import { BaseFrontendService } from '@/core/base';
import { ExportBackupSystemRepository } from './export-backup.repository';

export class ExportBackupSystemService extends BaseFrontendService<ExportBackupSystemRepository> {
  constructor(repo = new ExportBackupSystemRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.repo.execute<T>(query);
  }

}

export const exportbackupSystemService = new ExportBackupSystemService();
