import { BaseFrontendRepository } from '@/core/base';

export class SitePublicRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.get<T>('/v1/site', query);
  }

}
