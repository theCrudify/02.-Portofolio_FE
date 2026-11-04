import { BaseFrontendRepository } from '@/core/base';
import type { SignMediaPayloadDto, SignMediaQueryDto } from './sign.dto';

export class SignMediaRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: SignMediaPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/admin/media/sign', payload, query);
  }

}
