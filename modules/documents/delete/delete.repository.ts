import { BaseFrontendRepository } from '@/core/base';

export class DeleteDocumentsRepository extends BaseFrontendRepository {

  async execute(id: string) {
    return this.delete(`/v1/admin/documents/${encodeURIComponent(id)}`);
  }

}
