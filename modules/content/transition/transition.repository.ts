import { BaseFrontendRepository } from '@/core/base';
import type { TransitionContentPayloadDto, TransitionContentQueryDto } from './transition.dto';

export class TransitionContentRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(
    resource: string,
    id: string,
    action: 'publish' | 'unpublish' | 'archive' | 'restore',
  ) {
    return this.post<T>(`/v1/admin/${resource}/${encodeURIComponent(id)}/${action}`);
  }

}
