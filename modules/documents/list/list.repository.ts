import { BaseFrontendRepository } from '@/core/base';
import type { ListDocumentsQueryDto } from './list.dto';

export class ListDocumentsRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(query?: Partial<ListDocumentsQueryDto>) {
    return this.get<T[]>('/v1/admin/documents', query as Record<string, unknown>);
  }

}
