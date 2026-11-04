import { BaseFrontendRepository } from '@/core/base';

export class DetailMediaRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(id: string, query?: Record<string, unknown>) {
    return this.get<T>(`/v1/admin/media/${encodeURIComponent(id)}`, query);
  }

}
