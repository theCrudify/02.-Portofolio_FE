import { BaseFrontendService } from '@/core/base';
import type { ListContentPayloadDto, ListContentQueryDto } from './list.dto';
import { ListContentRepository } from './list.repository';

export class ListContentService extends BaseFrontendService<ListContentRepository> {
  constructor(repo = new ListContentRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(resource: string, query?: Partial<ListContentQueryDto>) {
    return this.repo.execute<T>(resource, query);
  }

}

export const listContentService = new ListContentService();
