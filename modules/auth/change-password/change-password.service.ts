import { BaseFrontendService } from '@/core/base';
import type { ChangePasswordAuthPayloadDto, ChangePasswordAuthQueryDto } from './change-password.dto';
import { ChangePasswordAuthRepository } from './change-password.repository';

export class ChangePasswordAuthService extends BaseFrontendService<ChangePasswordAuthRepository> {
  constructor(repo = new ChangePasswordAuthRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: ChangePasswordAuthPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const changepasswordAuthService = new ChangePasswordAuthService();
