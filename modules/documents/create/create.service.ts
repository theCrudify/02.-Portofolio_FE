import { BaseFrontendService } from '@/core/base';
import type { CreateDocumentsPayloadDto, CreateDocumentsQueryDto } from './create.dto';
import { CreateDocumentsRepository } from './create.repository';

export class CreateDocumentsService extends BaseFrontendService<CreateDocumentsRepository> {
  constructor(repo = new CreateDocumentsRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: CreateDocumentsPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const createDocumentsService = new CreateDocumentsService();
