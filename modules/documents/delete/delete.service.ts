import { BaseFrontendService } from '@/core/base';
import type { DeleteDocumentsPayloadDto, DeleteDocumentsQueryDto } from './delete.dto';
import { DeleteDocumentsRepository } from './delete.repository';

export class DeleteDocumentsService extends BaseFrontendService<DeleteDocumentsRepository> {
  constructor(repo = new DeleteDocumentsRepository()) {
    super(repo);
  }

  async execute(id: string) {
    return this.repo.execute(id);
  }

}

export const deleteDocumentsService = new DeleteDocumentsService();
