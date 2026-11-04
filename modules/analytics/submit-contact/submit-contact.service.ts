import { BaseFrontendService } from '@/core/base';
import type { SubmitContactAnalyticsPayloadDto, SubmitContactAnalyticsQueryDto } from './submit-contact.dto';
import { SubmitContactAnalyticsRepository } from './submit-contact.repository';

export class SubmitContactAnalyticsService extends BaseFrontendService<SubmitContactAnalyticsRepository> {
  constructor(repo = new SubmitContactAnalyticsRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: SubmitContactAnalyticsPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const submitcontactAnalyticsService = new SubmitContactAnalyticsService();
