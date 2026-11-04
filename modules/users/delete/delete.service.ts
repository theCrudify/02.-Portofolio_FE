import { BaseFrontendService } from '@/core/base';
import { DeleteUsersRepository } from './delete.repository';

export class DeleteUsersService extends BaseFrontendService<DeleteUsersRepository> {
  constructor(repo = new DeleteUsersRepository()) {
    super(repo);
  }

  async execute(id: string) {
    return this.repo.execute(id);
  }

}

export const deleteUsersService = new DeleteUsersService();
