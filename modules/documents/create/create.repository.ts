import { BaseFrontendRepository } from '@/core/base';
import type { CreateDocumentsPayloadDto } from './create.dto';

export class CreateDocumentsRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: CreateDocumentsPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/admin/documents', payload, query);
  }

}
