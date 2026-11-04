import { BaseFrontendRepository } from '@/core/base';

export class DeleteMediaRepository extends BaseFrontendRepository {

  async execute(id: string) {
    return this.delete(`/v1/admin/media/${encodeURIComponent(id)}`);
  }

}
