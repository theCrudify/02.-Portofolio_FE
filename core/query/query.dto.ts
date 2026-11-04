import { z } from 'zod';

const buildFlatQueryString = (maxLen = 120) =>
  z
    .string()
    .trim()
    .max(maxLen)
    .refine(
      (val) => {
        if (!val) return true;
        const trimmed = val.trim();
        return !(
          (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
          (trimmed.startsWith('[') && trimmed.endsWith(']'))
        );
      },
      { message: 'JSON strings are not allowed in query parameters; use flat query parameters.' },
    );

export const flatQueryString = Object.assign(buildFlatQueryString, {
  optional: () => buildFlatQueryString(120).optional(),
});

export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');
export type SortOrder = z.infer<typeof sortOrderSchema>;

export const booleanQueryParam = z
  .union([z.boolean(), z.enum(['true', 'false', '1', '0'])])
  .transform((val) => val === true || val === 'true' || val === '1')
  .optional();

export const standardQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: buildFlatQueryString(120).optional(),
  q: buildFlatQueryString(120).optional(),
  sortBy: buildFlatQueryString(60).optional(),
  sortOrder: sortOrderSchema.optional(),
  sort: buildFlatQueryString(64).optional(),
  all: booleanQueryParam.default(false),
});

export type StandardQueryDto = z.infer<typeof standardQuerySchema>;

export interface PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  all?: boolean;
}

export interface PaginatedResultDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}

export function createModuleQuerySchema<T extends z.ZodRawShape>(filterShape: T) {
  return standardQuerySchema.extend(filterShape);
}
