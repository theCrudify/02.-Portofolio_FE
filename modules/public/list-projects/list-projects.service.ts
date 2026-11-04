import { BaseFrontendService } from '@/core/base';
import type { ListProjectsPublicQueryDto } from './list-projects.dto';
import { ListProjectsPublicRepository } from './list-projects.repository';

export class ListProjectsPublicService extends BaseFrontendService<ListProjectsPublicRepository> {
  constructor(repo = new ListProjectsPublicRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Partial<ListProjectsPublicQueryDto>) {
    return this.repo.execute<T>(query);
  }

}

export const listprojectsPublicService = new ListProjectsPublicService();
