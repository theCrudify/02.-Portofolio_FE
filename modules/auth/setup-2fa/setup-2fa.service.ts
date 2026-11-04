import { BaseFrontendService } from '@/core/base';
import type { Setup2faAuthPayloadDto, Setup2faAuthQueryDto } from './setup-2fa.dto';
import { Setup2faAuthRepository } from './setup-2fa.repository';

export class Setup2faAuthService extends BaseFrontendService<Setup2faAuthRepository> {
  constructor(repo = new Setup2faAuthRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: Setup2faAuthPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const setup2faAuthService = new Setup2faAuthService();
