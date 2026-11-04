import { BaseFrontendService } from '@/core/base';
import type { LogoutAuthPayloadDto, LogoutAuthQueryDto } from './logout.dto';
import { LogoutAuthRepository } from './logout.repository';

export class LogoutAuthService extends BaseFrontendService<LogoutAuthRepository> {
  constructor(repo = new LogoutAuthRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: LogoutAuthPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const logoutAuthService = new LogoutAuthService();
