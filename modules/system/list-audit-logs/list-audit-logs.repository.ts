import { BaseFrontendRepository } from '@/core/base';
import type { ListAuditLogsSystemQueryDto } from './list-audit-logs.dto';

export class ListAuditLogsSystemRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Partial<ListAuditLogsSystemQueryDto>) {
    return this.get<T[]>('/v1/admin/audit-logs', query as Record<string, unknown>);
  }

}
