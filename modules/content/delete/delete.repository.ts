import { BaseFrontendRepository } from '@/core/base';

export class DeleteContentRepository extends BaseFrontendRepository {

  async execute(resource: string, id: string, permanent = false) {
    const suffix = permanent ? '/permanent' : '';
    return this.delete(`/v1/admin/${resource}/${encodeURIComponent(id)}${suffix}`);
  }

}
