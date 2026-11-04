import { BaseFrontendRepository } from '@/core/base';
import type { ListProjectsPublicQueryDto } from './list-projects.dto';

export class ListProjectsPublicRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Partial<ListProjectsPublicQueryDto>) {
    return this.get<T[]>('/v1/projects', query as Record<string, unknown>);
  }

}
