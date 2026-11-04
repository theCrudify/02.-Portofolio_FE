import { BaseFrontendService } from '@/core/base';
import type { Disable2faAuthPayloadDto } from './disable-2fa.dto';
import { Disable2faAuthRepository } from './disable-2fa.repository';

export class Disable2faAuthService extends BaseFrontendService<Disable2faAuthRepository> {
  constructor(repo = new Disable2faAuthRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: Disable2faAuthPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const disable2faAuthService = new Disable2faAuthService();
