import { BaseFrontendService } from '@/core/base';
import type { ListUsersQueryDto } from './list.dto';
import { ListUsersRepository } from './list.repository';

export class ListUsersService extends BaseFrontendService<ListUsersRepository> {
  constructor(repo = new ListUsersRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Partial<ListUsersQueryDto>) {
    return this.repo.execute<T>(query);
  }

}

export const listUsersService = new ListUsersService();
