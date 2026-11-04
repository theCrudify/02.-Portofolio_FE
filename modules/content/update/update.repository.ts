import { BaseFrontendRepository } from '@/core/base';
import type { UpdateContentPayloadDto, UpdateContentQueryDto } from './update.dto';

export class UpdateContentRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(resource: string, id: string, payload: UpdateContentPayloadDto) {
    return this.put<T>(`/v1/admin/${resource}/${encodeURIComponent(id)}`, payload);
  }

}
