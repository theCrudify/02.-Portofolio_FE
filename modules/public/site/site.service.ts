import { BaseFrontendService } from '@/core/base';
import type { SitePublicPayloadDto, SitePublicQueryDto } from './site.dto';
import { SitePublicRepository } from './site.repository';

export class SitePublicService extends BaseFrontendService<SitePublicRepository> {
  constructor(repo = new SitePublicRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.repo.execute<T>(query);
  }

}

export const sitePublicService = new SitePublicService();
