import { BaseFrontendRepository } from '@/core/base';
import type { LogoutAuthPayloadDto } from './logout.dto';

export class LogoutAuthRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: LogoutAuthPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/auth/logout', payload, query);
  }

}
