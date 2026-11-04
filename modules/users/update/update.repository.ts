import { BaseFrontendRepository } from '@/core/base';
import type { UpdateUsersPayloadDto } from './update.dto';

export class UpdateUsersRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(id: string, payload: UpdateUsersPayloadDto) {
    return this.patch<T>(`/v1/admin/users/${encodeURIComponent(id)}`, payload);
  }

}
