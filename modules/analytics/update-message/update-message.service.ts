import { BaseFrontendService } from '@/core/base';
import type { UpdateMessageAnalyticsPayloadDto } from './update-message.dto';
import { UpdateMessageAnalyticsRepository } from './update-message.repository';

export class UpdateMessageAnalyticsService extends BaseFrontendService<UpdateMessageAnalyticsRepository> {
  constructor(repo = new UpdateMessageAnalyticsRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(id: string, payload: UpdateMessageAnalyticsPayloadDto) {
    return this.repo.execute<T>(id, payload);
  }

}

export const updatemessageAnalyticsService = new UpdateMessageAnalyticsService();
