import { BaseFrontendRepository } from '@/core/base';
import type { UpdateMessageAnalyticsPayloadDto, UpdateMessageAnalyticsQueryDto } from './update-message.dto';

export class UpdateMessageAnalyticsRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(id: string, payload: UpdateMessageAnalyticsPayloadDto) {
    return this.patch<T>(`/v1/admin/messages/${encodeURIComponent(id)}`, payload);
  }

}
