import { BaseFrontendService } from '@/core/base';
import type { Enable2faAuthPayloadDto } from './enable-2fa.dto';
import { Enable2faAuthRepository } from './enable-2fa.repository';

export class Enable2faAuthService extends BaseFrontendService<Enable2faAuthRepository> {
  constructor(repo = new Enable2faAuthRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: Enable2faAuthPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const enable2faAuthService = new Enable2faAuthService();
