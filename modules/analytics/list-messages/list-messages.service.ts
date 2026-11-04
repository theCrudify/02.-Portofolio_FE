import { BaseFrontendService } from '@/core/base';
import type { ListMessagesAnalyticsQueryDto } from './list-messages.dto';
import { ListMessagesAnalyticsRepository } from './list-messages.repository';

export class ListMessagesAnalyticsService extends BaseFrontendService<ListMessagesAnalyticsRepository> {
  constructor(repo = new ListMessagesAnalyticsRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Partial<ListMessagesAnalyticsQueryDto>) {
    return this.repo.execute<T>(query);
  }

}

export const listmessagesAnalyticsService = new ListMessagesAnalyticsService();
