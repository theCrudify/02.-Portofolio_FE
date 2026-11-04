import { BaseFrontendService } from '@/core/base';
import type { EmbedMediaPayloadDto } from './embed.dto';
import { EmbedMediaRepository } from './embed.repository';

export class EmbedMediaService extends BaseFrontendService<EmbedMediaRepository> {
  constructor(repo = new EmbedMediaRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(payload?: EmbedMediaPayloadDto, query?: Record<string, unknown>) {
    return this.repo.execute<T>(payload, query);
  }

}

export const embedMediaService = new EmbedMediaService();
