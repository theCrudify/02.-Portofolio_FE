import { BaseFrontendService } from '@/core/base';
import type { ListDocumentsPayloadDto, ListDocumentsQueryDto } from './list.dto';
import { ListDocumentsRepository } from './list.repository';

export class ListDocumentsService extends BaseFrontendService<ListDocumentsRepository> {
  constructor(repo = new ListDocumentsRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Partial<ListDocumentsQueryDto>) {
    return this.repo.execute<T>(query);
  }

}

export const listDocumentsService = new ListDocumentsService();
