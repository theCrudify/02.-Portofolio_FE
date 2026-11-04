import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/lib/api/client';

describe('api() URL normalisation', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ['/v1/admin/projects', '/api/v1/admin/projects'],
    ['/api/v1/admin/projects', '/api/v1/admin/projects'],
    ['/admin/projects', '/api/v1/admin/projects'],
    ['auth/login', '/api/v1/auth/login'],
    ['/v1abc', '/api/v1/v1abc'],
  ])('%s -> %s', async (input, expected) => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ data: null })));
    vi.stubGlobal('fetch', fetchMock);
    await api(input);
    expect(fetchMock).toHaveBeenCalledWith(expected, expect.anything());
  });
});
