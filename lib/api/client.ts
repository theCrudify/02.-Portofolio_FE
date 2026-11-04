export interface ApiErrorDetail {
  path: string;
  message: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: ApiErrorDetail[];

  constructor(status: number, code: string, message: string, details?: ApiErrorDetail[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface ApiListResponse<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<ApiListResponse<T>> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = normalizedPath.startsWith('/api/v1')
    ? normalizedPath
    : `/api/v1${normalizedPath}`;

  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (res.status === 204) {
    return { data: undefined as unknown as T };
  }

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const errObj =
      payload && typeof payload === 'object' && 'error' in payload
        ? (payload as {
            error?: { code?: string; message?: string; details?: ApiErrorDetail[] };
          }).error
        : undefined;

    throw new ApiError(
      res.status,
      errObj?.code ?? 'INTERNAL_ERROR',
      errObj?.message ?? `Request failed with status ${res.status}`,
      errObj?.details,
    );
  }

  return payload as ApiListResponse<T>;
}
