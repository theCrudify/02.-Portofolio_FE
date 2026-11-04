import { BaseFrontendService } from '@/core/base';
import type { ListMediaPayloadDto, ListMediaQueryDto } from './list.dto';
import { ListMediaRepository } from './list.repository';

export class ListMediaService extends BaseFrontendService<ListMediaRepository> {
  constructor(repo = new ListMediaRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Partial<ListMediaQueryDto>) {
    return this.repo.execute<T>(query);
  }

}

export const listMediaService = new ListMediaService();
