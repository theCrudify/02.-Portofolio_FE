import { BaseFrontendService } from '@/core/base';
import type { Verify2faAuthPayloadDto } from './verify-2fa.dto';
import { Verify2faAuthRepository } from './verify-2fa.repository';

export class Verify2faAuthService extends BaseFrontendService<Verify2faAuthRepository> {
  constructor(repo = new Verify2faAuthRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: Verify2faAuthPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const verify2faAuthService = new Verify2faAuthService();
