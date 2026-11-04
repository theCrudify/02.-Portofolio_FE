import { BaseFrontendService } from '@/core/base';
import type { DeleteContentPayloadDto, DeleteContentQueryDto } from './delete.dto';
import { DeleteContentRepository } from './delete.repository';

export class DeleteContentService extends BaseFrontendService<DeleteContentRepository> {
  constructor(repo = new DeleteContentRepository()) {
    super(repo);
  }

  async execute(resource: string, id: string, permanent = false) {
    return this.repo.execute(resource, id, permanent);
  }

}

export const deleteContentService = new DeleteContentService();
