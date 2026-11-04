import { BaseFrontendService } from '@/core/base';
import type { MeAuthPayloadDto, MeAuthQueryDto } from './me.dto';
import { MeAuthRepository } from './me.repository';

export class MeAuthService extends BaseFrontendService<MeAuthRepository> {
  constructor(repo = new MeAuthRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.repo.execute<T>(query);
  }

}

export const meAuthService = new MeAuthService();
