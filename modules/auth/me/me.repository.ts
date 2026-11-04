import { BaseFrontendRepository } from '@/core/base';
import type { MeAuthPayloadDto, MeAuthQueryDto } from './me.dto';

export class MeAuthRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.get<T>('/v1/auth/me', query);
  }

}
