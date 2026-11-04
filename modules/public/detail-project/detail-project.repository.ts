import { BaseFrontendRepository } from '@/core/base';

export class DetailProjectPublicRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(id: string, query?: Record<string, unknown>) {
    return this.get<T>(`/v1/projects/${encodeURIComponent(id)}`, query);
  }

}
