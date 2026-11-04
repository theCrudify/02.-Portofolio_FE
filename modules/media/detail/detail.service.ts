import { BaseFrontendService } from '@/core/base';
import type { DetailMediaPayloadDto, DetailMediaQueryDto } from './detail.dto';
import { DetailMediaRepository } from './detail.repository';

export class DetailMediaService extends BaseFrontendService<DetailMediaRepository> {
  constructor(repo = new DetailMediaRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(id: string, query?: Record<string, unknown>) {
    return this.repo.execute<T>(id, query);
  }

}

export const detailMediaService = new DetailMediaService();
