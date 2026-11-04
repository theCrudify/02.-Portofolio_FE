import { BaseFrontendRepository } from '@/core/base';
import type { ListMediaQueryDto } from './list.dto';

export class ListMediaRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Partial<ListMediaQueryDto>) {
    return this.get<T[]>('/v1/admin/media', query as Record<string, unknown>);
  }

}
