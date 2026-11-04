import { BaseFrontendRepository } from '@/core/base';

export class UpdateDocumentsRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(id: string) {
    return this.post<T>(`/v1/admin/documents/${encodeURIComponent(id)}/activate`);
  }

}
