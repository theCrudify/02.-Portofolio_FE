import { BaseFrontendRepository } from '@/core/base';

export class DeleteUsersRepository extends BaseFrontendRepository {

  async execute(id: string) {
    return this.delete(`/v1/admin/users/${encodeURIComponent(id)}`);
  }

}
