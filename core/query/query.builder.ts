import type { PaginatedResultDto, PaginationMetaDto, SortOrder } from './query.dto';

export interface ClientQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  sort?: string;
  all?: boolean;
  filters?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * FrontendQueryBuilder: Clean OOP Query Engine for building strictly flat URL query strings
 * (Zero-JSON in Query policy) and performing fast client-side filtering, searching, sorting,
 * pagination, and full-query execution.
 */
export class FrontendQueryBuilder {
  static isJsonLike(value: string): boolean {
    const trimmed = value.trim();
    return (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    );
  }

  static assertFlatQuery(params: Record<string, unknown>): void {
    for (const [key, rawValue] of Object.entries(params)) {
      if (rawValue === undefined || rawValue === null) continue;
      if (typeof rawValue === 'object') {
        throw new Error(`Query parameter "${key}" must be a flat primitive, not an object or array.`);
      }
      const strVal = String(rawValue);
      if (this.isJsonLike(strVal)) {
        throw new Error(
          `JSON strings are not allowed in query parameter "${key}"; use flat query parameters.`,
        );
      }
    }
  }

  static toQueryString(params: Record<string, unknown> = {}): string {
    this.assertFlatQuery(params);
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;
      if (key === 'all' && value === false) continue;
      searchParams.set(key, String(value));
    }
    const qs = searchParams.toString();
    return qs ? `?${qs}` : '';
  }

  static buildMeta(page: number, limit: number, total: number, all = false): PaginationMetaDto {
    const effectiveLimit = all ? Math.max(total, 1) : Math.max(limit, 1);
    const totalPages = Math.max(1, Math.ceil(total / effectiveLimit));
    return {
      page: all ? 1 : page,
      limit: all ? total : limit,
      total,
      totalPages,
      hasNextPage: !all && page < totalPages,
      hasPrevPage: !all && page > 1,
      ...(all ? { all: true } : {}),
    };
  }

  static executeClientQuery<T extends Record<string, unknown>>(
    items: T[],
    options: ClientQueryOptions,
    searchableKeys: string[] = [],
    defaultSortKey?: string,
    defaultSortOrder: SortOrder = 'desc',
  ): PaginatedResultDto<T> {
    let result = [...items];

    // 1. Fast equality filters
    if (options.filters) {
      for (const [key, val] of Object.entries(options.filters)) {
        if (val === undefined || val === null || val === '' || val === 'all') continue;
        result = result.filter((item) => item[key] === val);
      }
    }

    // 2. Search (search or q)
    const term = (options.search ?? options.q ?? '').trim().toLowerCase();
    if (term.length > 0) {
      if (this.isJsonLike(term)) {
        throw new Error('JSON strings are not allowed in search query.');
      }
      const keysToSearch =
        searchableKeys.length > 0
          ? searchableKeys
          : Object.keys(result[0] ?? {});
      result = result.filter((item) =>
        keysToSearch.some((k) => {
          const val = item[k];
          if (typeof val === 'string') return val.toLowerCase().includes(term);
          if (typeof val === 'number') return String(val).includes(term);
          return false;
        }),
      );
    }

    // 3. Fast Sort (sortBy + sortOrder or shorthand sort)
    let sortKey = options.sortBy;
    let sortDir: SortOrder = options.sortOrder ?? defaultSortOrder;
    if (!sortKey && options.sort) {
      if (options.sort.startsWith('-')) {
        sortKey = options.sort.slice(1);
        sortDir = 'desc';
      } else {
        sortKey = options.sort.startsWith('+') ? options.sort.slice(1) : options.sort;
        sortDir = options.sortOrder ?? 'asc';
      }
    }
    const effectiveSortKey = sortKey ?? defaultSortKey;
    if (effectiveSortKey) {
      const k = effectiveSortKey;
      result.sort((a, b) => {
        const va = a[k];
        const vb = b[k];
        if (va === vb) return 0;
        if (va === null || va === undefined) return 1;
        if (vb === null || vb === undefined) return -1;
        const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    // 4. Full Query vs Paginated
    const page = Math.max(1, Math.floor(Number(options.page ?? 1)));
    const limit = Math.max(1, Math.min(100, Math.floor(Number(options.limit ?? 20))));
    const total = result.length;

    if (options.all) {
      return {
        data: result,
        meta: this.buildMeta(1, total || limit, total, true),
      };
    }

    const offset = (page - 1) * limit;
    return {
      data: result.slice(offset, offset + limit),
      meta: this.buildMeta(page, limit, total, false),
    };
  }
}
