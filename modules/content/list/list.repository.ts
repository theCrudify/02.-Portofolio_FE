import { BaseFrontendRepository } from '@/core/base';
import type { ListContentQueryDto } from './list.dto';

export class ListContentRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(resource: string, query?: Partial<ListContentQueryDto>) {
    return this.get<T[]>(`/v1/admin/${resource}`, query as Record<string, unknown>);
  }

}
