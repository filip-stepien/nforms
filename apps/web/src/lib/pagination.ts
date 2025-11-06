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

function getSearchParamsSchema(
    { page, pageSize }: { page: string; pageSize: string } = { page: 'page', pageSize: 'pageSize' }
) {
    return z.object({
        [page]: z
            .string()
            .optional()
            .transform(val => (val ? parseInt(val) : defaultPaginationParams.page))
            .refine(val => Number.isInteger(val) && val > 0),
        [pageSize]: z
            .string()
            .optional()
            .transform(val => (val ? parseInt(val) : defaultPaginationParams.pageSize))
            .refine(val => Number.isInteger(val) && val > 0)
    });
}

export function getPaginationSearchParams(
    searchParams: unknown,
    paramNames: { page: string; pageSize: string } = { page: 'page', pageSize: 'pageSize' }
): { page: number; pageSize: number; suspenseKey: string } {
    const schema = getSearchParamsSchema(paramNames);
    const params = schema.safeParse(searchParams);

    if (params.success) {
        const page = params.data[paramNames.page];
        const pageSize = params.data[paramNames.pageSize];

        return {
            page,
            pageSize,
            suspenseKey: `${page}${pageSize}`
        };
    }

    return {
        ...defaultPaginationParams,
        suspenseKey: ''
    };
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
