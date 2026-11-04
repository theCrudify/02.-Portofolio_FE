import { BaseFrontendRepository } from '@/core/base';
import type { DeleteDocumentsPayloadDto, DeleteDocumentsQueryDto } from './delete.dto';

export class DeleteDocumentsRepository extends BaseFrontendRepository {

  async execute(id: string) {
    return this.delete(`/v1/admin/documents/${encodeURIComponent(id)}`);
  }

}
