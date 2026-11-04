import { BaseFrontendRepository } from '@/core/base';
import type { CreateMediaPayloadDto, CreateMediaQueryDto } from './create.dto';

export class CreateMediaRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: CreateMediaPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/admin/media', payload, query);
  }

}
