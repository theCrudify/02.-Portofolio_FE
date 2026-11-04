import { BaseFrontendRepository } from '@/core/base';

export class MeAuthRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.get<T>('/v1/auth/me', query);
  }

}
