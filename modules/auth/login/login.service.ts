import { BaseFrontendService } from '@/core/base';
import type { LoginAuthPayloadDto } from './login.dto';
import { LoginAuthRepository } from './login.repository';

export class LoginAuthService extends BaseFrontendService<LoginAuthRepository> {
  constructor(repo = new LoginAuthRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: LoginAuthPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const loginAuthService = new LoginAuthService();
