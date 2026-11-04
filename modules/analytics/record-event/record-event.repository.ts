import { BaseFrontendRepository } from '@/core/base';
import type { RecordEventAnalyticsPayloadDto } from './record-event.dto';

export class RecordEventAnalyticsRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: RecordEventAnalyticsPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/events', payload, query);
  }

}
