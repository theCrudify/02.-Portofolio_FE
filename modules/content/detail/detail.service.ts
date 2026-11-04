import { BaseFrontendService } from '@/core/base';
import { DetailContentRepository } from './detail.repository';

export class DetailContentService extends BaseFrontendService<DetailContentRepository> {
  constructor(repo = new DetailContentRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(resource: string, id: string) {
    return this.repo.execute<T>(resource, id);
  }

}

export const detailContentService = new DetailContentService();
