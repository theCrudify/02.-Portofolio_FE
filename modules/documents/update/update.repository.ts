import { BaseFrontendRepository } from '@/core/base';
import type { UpdateDocumentsPayloadDto, UpdateDocumentsQueryDto } from './update.dto';

export class UpdateDocumentsRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(id: string) {
    return this.post<T>(`/v1/admin/documents/${encodeURIComponent(id)}/activate`);
  }

}
