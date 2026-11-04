import { BaseFrontendRepository } from '@/core/base';
import type { DetailContentPayloadDto, DetailContentQueryDto } from './detail.dto';

export class DetailContentRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(resource: string, id: string) {
    return this.get<T>(`/v1/admin/${resource}/${encodeURIComponent(id)}`);
  }

}
