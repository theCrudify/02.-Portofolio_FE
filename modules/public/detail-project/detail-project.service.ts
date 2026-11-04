import { BaseFrontendService } from '@/core/base';
import { DetailProjectPublicRepository } from './detail-project.repository';

export class DetailProjectPublicService extends BaseFrontendService<DetailProjectPublicRepository> {
  constructor(repo = new DetailProjectPublicRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(id: string, query?: Record<string, unknown>) {
    return this.repo.execute<T>(id, query);
  }

}

export const detailprojectPublicService = new DetailProjectPublicService();
