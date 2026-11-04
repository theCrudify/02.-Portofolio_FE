import { BaseFrontendRepository } from '@/core/base';
import type { EmbedMediaPayloadDto, EmbedMediaQueryDto } from './embed.dto';

export class EmbedMediaRepository extends BaseFrontendRepository {

  async execute<T = Record<string, unknown>>(payload?: EmbedMediaPayloadDto, query?: Record<string, unknown>) {
    return this.post<T>('/v1/admin/media/embed', payload, query);
  }

}
