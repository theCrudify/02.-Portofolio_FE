import { BaseFrontendRepository } from '@/core/base';
import type { ListMessagesAnalyticsQueryDto } from './list-messages.dto';

export class ListMessagesAnalyticsRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Partial<ListMessagesAnalyticsQueryDto>) {
    return this.get<T[]>('/v1/admin/messages', query as Record<string, unknown>);
  }

}
