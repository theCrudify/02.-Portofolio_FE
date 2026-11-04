import { BaseFrontendService } from '@/core/base';
import type { UpdateContentPayloadDto } from './update.dto';
import { UpdateContentRepository } from './update.repository';

export class UpdateContentService extends BaseFrontendService<UpdateContentRepository> {
  constructor(repo = new UpdateContentRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(resource: string, id: string, payload: UpdateContentPayloadDto) {
    return this.repo.execute<T>(resource, id, payload);
  }

}

export const updateContentService = new UpdateContentService();
