import { BaseFrontendRepository } from '@/core/base';

export class DetailContentRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(resource: string, id: string) {
    return this.get<T>(`/v1/admin/${resource}/${encodeURIComponent(id)}`);
  }

}
