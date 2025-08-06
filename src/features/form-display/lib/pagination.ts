import z from 'zod';

export type PaginationParams = {
    page: number;
    pageSize: number;
};

export type PaginationMetaParams = PaginationParams & {
    totalCount: number;
};

export type PaginationMeta = {
    totalCount: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export const defaultPaginationParams: PaginationParams = {
    page: 1,
    pageSize: 10
};

const searchParamsSchema = z.object({
    page: z
        .string()
        .optional()
        .transform(val => (val ? parseInt(val) : defaultPaginationParams.page))
        .refine(val => Number.isInteger(val) && val > 0),
    pageSize: z
        .string()
        .optional()
        .transform(val => (val ? parseInt(val) : defaultPaginationParams.pageSize))
        .refine(val => Number.isInteger(val) && val > 0)
});

export function getPaginationSearchParams(searchParams: unknown): PaginationParams {
    const params = searchParamsSchema.safeParse(searchParams);
    return params.success ? params.data : defaultPaginationParams;
}

export function getPaginationQueryParams({ page, pageSize }: PaginationParams) {
    return {
        skip: (page - 1) * pageSize,
        take: pageSize
    };
}

export function getPaginationMeta(metaParams: PaginationMetaParams): PaginationMeta {
    const { page, pageSize, totalCount } = metaParams;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        totalCount,
        totalPages,
        pageSize,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
}
