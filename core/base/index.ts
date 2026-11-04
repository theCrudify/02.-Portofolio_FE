import { apiFetch, type ApiListResponse } from '@/lib/api/client';
import { FrontendQueryBuilder } from '@/core/query';

/**
 * BaseFrontendRepository: Standardized HTTP data-access layer for Frontend action modules.
 */
export abstract class BaseFrontendRepository {
  protected async get<T>(
    path: string,
    query?: Record<string, unknown>,
    init?: RequestInit,
  ): Promise<ApiListResponse<T>> {
    const qs = query ? FrontendQueryBuilder.toQueryString(query) : '';
    return apiFetch<T>(`${path}${qs}`, { ...init, method: 'GET' });
  }

  protected async post<T>(
    path: string,
    body?: unknown,
    query?: Record<string, unknown>,
    init?: RequestInit,
  ): Promise<ApiListResponse<T>> {
    const qs = query ? FrontendQueryBuilder.toQueryString(query) : '';
    return apiFetch<T>(`${path}${qs}`, {
      ...init,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  protected async put<T>(
    path: string,
    body?: unknown,
    init?: RequestInit,
  ): Promise<ApiListResponse<T>> {
    return apiFetch<T>(path, {
      ...init,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  protected async patch<T>(
    path: string,
    body?: unknown,
    init?: RequestInit,
  ): Promise<ApiListResponse<T>> {
    return apiFetch<T>(path, {
      ...init,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  protected async delete<T = void>(
    path: string,
    init?: RequestInit,
  ): Promise<ApiListResponse<T>> {
    return apiFetch<T>(path, { ...init, method: 'DELETE' });
  }
}

/**
 * BaseFrontendService: Standardized business logic layer wrapping a Frontend Repository.
 */
export abstract class BaseFrontendService<TRepo extends BaseFrontendRepository> {
  constructor(protected readonly repo: TRepo) {}
}
