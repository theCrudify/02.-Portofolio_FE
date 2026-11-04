import { BaseFrontendService } from '@/core/base';
import type { UpdateDocumentsPayloadDto, UpdateDocumentsQueryDto } from './update.dto';
import { UpdateDocumentsRepository } from './update.repository';

export class UpdateDocumentsService extends BaseFrontendService<UpdateDocumentsRepository> {
  constructor(repo = new UpdateDocumentsRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(id: string) {
    return this.repo.execute<T>(id);
  }

}

export const updateDocumentsService = new UpdateDocumentsService();
