import { BaseFrontendRepository } from '@/core/base';
import type { ReorderContentPayloadDto, ReorderContentQueryDto } from './reorder.dto';

export class ReorderContentRepository extends BaseFrontendRepository {

  async execute(resource: string, ids: string[]) {
    return this.put(`/v1/admin/${resource}/reorder`, { ids });
  }

}
