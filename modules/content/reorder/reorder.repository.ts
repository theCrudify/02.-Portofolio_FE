import { BaseFrontendRepository } from '@/core/base';

export class ReorderContentRepository extends BaseFrontendRepository {

  async execute(resource: string, ids: string[]) {
    return this.put(`/v1/admin/${resource}/reorder`, { ids });
  }

}
