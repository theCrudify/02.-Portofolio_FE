import { BaseFrontendService } from '@/core/base';
import type { ListAuditLogsSystemPayloadDto, ListAuditLogsSystemQueryDto } from './list-audit-logs.dto';
import { ListAuditLogsSystemRepository } from './list-audit-logs.repository';

export class ListAuditLogsSystemService extends BaseFrontendService<ListAuditLogsSystemRepository> {
  constructor(repo = new ListAuditLogsSystemRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Partial<ListAuditLogsSystemQueryDto>) {
    return this.repo.execute<T>(query);
  }

}

export const listauditlogsSystemService = new ListAuditLogsSystemService();
