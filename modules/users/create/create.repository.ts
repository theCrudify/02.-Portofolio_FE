import { BaseFrontendRepository } from '@/core/base';
import type { CreateUsersPayloadDto, CreateUsersQueryDto } from './create.dto';

export class CreateUsersRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: CreateUsersPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/admin/users', payload, query);
  }

}
