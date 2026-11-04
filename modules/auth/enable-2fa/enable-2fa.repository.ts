import { BaseFrontendRepository } from '@/core/base';
import type { Enable2faAuthPayloadDto, Enable2faAuthQueryDto } from './enable-2fa.dto';

export class Enable2faAuthRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: Enable2faAuthPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/auth/2fa/enable', payload, query);
  }

}
