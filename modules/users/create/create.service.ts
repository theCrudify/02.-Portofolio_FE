import { BaseFrontendService } from '@/core/base';
import type { CreateUsersPayloadDto, CreateUsersQueryDto } from './create.dto';
import { CreateUsersRepository } from './create.repository';

export class CreateUsersService extends BaseFrontendService<CreateUsersRepository> {
  constructor(repo = new CreateUsersRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: CreateUsersPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const createUsersService = new CreateUsersService();
