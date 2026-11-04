import { BaseFrontendService } from '@/core/base';
import type { RecordEventAnalyticsPayloadDto, RecordEventAnalyticsQueryDto } from './record-event.dto';
import { RecordEventAnalyticsRepository } from './record-event.repository';

export class RecordEventAnalyticsService extends BaseFrontendService<RecordEventAnalyticsRepository> {
  constructor(repo = new RecordEventAnalyticsRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: RecordEventAnalyticsPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const recordeventAnalyticsService = new RecordEventAnalyticsService();
