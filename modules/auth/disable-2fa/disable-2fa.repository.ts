import { BaseFrontendRepository } from '@/core/base';
import type { Disable2faAuthPayloadDto } from './disable-2fa.dto';

export class Disable2faAuthRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: Disable2faAuthPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/auth/2fa/disable', payload, query);
  }

}
