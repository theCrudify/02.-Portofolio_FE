import { BaseFrontendRepository } from '@/core/base';
import type { CreateContentPayloadDto, CreateContentQueryDto } from './create.dto';

export class CreateContentRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(resource: string, payload: CreateContentPayloadDto) {
    return this.post<T>(`/v1/admin/${resource}`, payload);
  }

}
