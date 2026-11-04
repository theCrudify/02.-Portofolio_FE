import { BaseFrontendRepository } from '@/core/base';
import type { LoginAuthPayloadDto } from './login.dto';

export class LoginAuthRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: LoginAuthPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/auth/login', payload, query);
  }

}
