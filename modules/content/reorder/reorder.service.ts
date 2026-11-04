import { BaseFrontendService } from '@/core/base';
import { ReorderContentRepository } from './reorder.repository';

export class ReorderContentService extends BaseFrontendService<ReorderContentRepository> {
  constructor(repo = new ReorderContentRepository()) {
    super(repo);
  }

  async execute(resource: string, ids: string[]) {
    return this.repo.execute(resource, ids);
  }

}

export const reorderContentService = new ReorderContentService();
