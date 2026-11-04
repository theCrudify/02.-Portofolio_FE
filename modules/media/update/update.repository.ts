import { BaseFrontendRepository } from '@/core/base';
import type { UpdateMediaPayloadDto } from './update.dto';

export class UpdateMediaRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(id: string, payload: UpdateMediaPayloadDto) {
    return this.put<T>(`/v1/admin/media/${encodeURIComponent(id)}`, payload);
  }

}
