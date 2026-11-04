import { BaseFrontendService } from '@/core/base';
import type { TransitionContentPayloadDto, TransitionContentQueryDto } from './transition.dto';
import { TransitionContentRepository } from './transition.repository';

export class TransitionContentService extends BaseFrontendService<TransitionContentRepository> {
  constructor(repo = new TransitionContentRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(
    resource: string,
    id: string,
    action: 'publish' | 'unpublish' | 'archive' | 'restore',
  ) {
    return this.repo.execute<T>(resource, id, action);
  }

}

export const transitionContentService = new TransitionContentService();
