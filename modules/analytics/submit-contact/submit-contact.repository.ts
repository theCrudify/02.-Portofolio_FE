import { BaseFrontendRepository } from '@/core/base';
import type { SubmitContactAnalyticsPayloadDto } from './submit-contact.dto';

export class SubmitContactAnalyticsRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: SubmitContactAnalyticsPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/contact', payload, query);
  }

}
