import { BaseFrontendService } from '@/core/base';
import { DeleteMediaRepository } from './delete.repository';

export class DeleteMediaService extends BaseFrontendService<DeleteMediaRepository> {
  constructor(repo = new DeleteMediaRepository()) {
    super(repo);
  }

  async execute(id: string) {
    return this.repo.execute(id);
  }

}

export const deleteMediaService = new DeleteMediaService();
