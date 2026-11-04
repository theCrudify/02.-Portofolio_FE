import { BaseFrontendService } from '@/core/base';
import type { SummaryAnalyticsPayloadDto, SummaryAnalyticsQueryDto } from './summary.dto';
import { SummaryAnalyticsRepository } from './summary.repository';

export class SummaryAnalyticsService extends BaseFrontendService<SummaryAnalyticsRepository> {
  constructor(repo = new SummaryAnalyticsRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.repo.execute<T>(query);
  }

}

export const summaryAnalyticsService = new SummaryAnalyticsService();
