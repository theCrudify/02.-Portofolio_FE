import { BaseFrontendRepository } from '@/core/base';
import type { ChangePasswordAuthPayloadDto, ChangePasswordAuthQueryDto } from './change-password.dto';

export class ChangePasswordAuthRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: ChangePasswordAuthPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/auth/password', payload, query);
  }

}
