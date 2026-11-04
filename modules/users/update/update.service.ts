import { BaseFrontendService } from '@/core/base';
import type { UpdateUsersPayloadDto, UpdateUsersQueryDto } from './update.dto';
import { UpdateUsersRepository } from './update.repository';

export class UpdateUsersService extends BaseFrontendService<UpdateUsersRepository> {
  constructor(repo = new UpdateUsersRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(id: string, payload: UpdateUsersPayloadDto) {
    return this.repo.execute<T>(id, payload);
  }

}

export const updateUsersService = new UpdateUsersService();
