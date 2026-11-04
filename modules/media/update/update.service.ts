import { BaseFrontendService } from '@/core/base';
import type { UpdateMediaPayloadDto } from './update.dto';
import { UpdateMediaRepository } from './update.repository';

export class UpdateMediaService extends BaseFrontendService<UpdateMediaRepository> {
  constructor(repo = new UpdateMediaRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(id: string, payload: UpdateMediaPayloadDto) {
    return this.repo.execute<T>(id, payload);
  }

}

export const updateMediaService = new UpdateMediaService();
