import { BaseFrontendService } from '@/core/base';
import { HealthSystemRepository } from './health.repository';

export class HealthSystemService extends BaseFrontendService<HealthSystemRepository> {
  constructor(repo = new HealthSystemRepository()) {
    super(repo);
  }

  async execute<T = Record<string, unknown>>(query?: Record<string, unknown>) {
    return this.repo.execute<T>(query);
  }

}

export const healthSystemService = new HealthSystemService();
