import { BaseFrontendRepository } from '@/core/base';
import type { SummaryAnalyticsPayloadDto, SummaryAnalyticsQueryDto } from './summary.dto';

export class SummaryAnalyticsRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.get<T>('/v1/admin/analytics', query);
  }

}
