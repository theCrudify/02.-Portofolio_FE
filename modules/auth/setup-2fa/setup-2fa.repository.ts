import { BaseFrontendRepository } from '@/core/base';
import type { Setup2faAuthPayloadDto } from './setup-2fa.dto';

export class Setup2faAuthRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: Setup2faAuthPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/auth/2fa/setup', payload, query);
  }

}
