import { BaseFrontendService } from '@/core/base';
import type { ListCertificationsPublicPayloadDto, ListCertificationsPublicQueryDto } from './list-certifications.dto';
import { ListCertificationsPublicRepository } from './list-certifications.repository';

export class ListCertificationsPublicService extends BaseFrontendService<ListCertificationsPublicRepository> {
  constructor(repo = new ListCertificationsPublicRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Partial<ListCertificationsPublicQueryDto>) {
    return this.repo.execute<T>(query);
  }

}

export const listcertificationsPublicService = new ListCertificationsPublicService();
