import { BaseFrontendService } from '@/core/base';
import type { CreateMediaPayloadDto } from './create.dto';
import { CreateMediaRepository } from './create.repository';

export class CreateMediaService extends BaseFrontendService<CreateMediaRepository> {
  constructor(repo = new CreateMediaRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: CreateMediaPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const createMediaService = new CreateMediaService();
