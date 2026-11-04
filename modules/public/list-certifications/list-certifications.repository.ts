import { BaseFrontendRepository } from '@/core/base';
import type { ListCertificationsPublicPayloadDto, ListCertificationsPublicQueryDto } from './list-certifications.dto';

export class ListCertificationsPublicRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Partial<ListCertificationsPublicQueryDto>) {
    return this.get<T[]>('/v1/certifications', query as Record<string, unknown>);
  }

}
