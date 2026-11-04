import { BaseFrontendRepository } from '@/core/base';
import type { Verify2faAuthPayloadDto } from './verify-2fa.dto';

export class Verify2faAuthRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: Verify2faAuthPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/auth/2fa/verify', payload, query);
  }

}
