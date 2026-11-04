import { BaseFrontendService } from '@/core/base';
import type { SignMediaPayloadDto } from './sign.dto';
import { SignMediaRepository } from './sign.repository';

export class SignMediaService extends BaseFrontendService<SignMediaRepository> {
  constructor(repo = new SignMediaRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: SignMediaPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const signMediaService = new SignMediaService();
