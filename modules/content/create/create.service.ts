import { BaseFrontendService } from '@/core/base';
import type { CreateContentPayloadDto, CreateContentQueryDto } from './create.dto';
import { CreateContentRepository } from './create.repository';

export class CreateContentService extends BaseFrontendService<CreateContentRepository> {
  constructor(repo = new CreateContentRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(resource: string, payload: CreateContentPayloadDto) {
    return this.repo.execute<T>(resource, payload);
  }

}

export const createContentService = new CreateContentService();
