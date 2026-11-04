import { BaseFrontendRepository } from '@/core/base';
import type { ListUsersQueryDto } from './list.dto';

export class ListUsersRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Partial<ListUsersQueryDto>) {
    return this.get<T[]>('/v1/admin/users', query as Record<string, unknown>);
  }

}
