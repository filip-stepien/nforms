import { defaultPaginationParamNames, PaginationParamNames } from '@/lib/pagination';
import { useRouter, useSearchParams } from 'next/navigation';

export function usePaginationParamSetter(paramNames?: Partial<PaginationParamNames>) {
    const {
        page: pageParamName = defaultPaginationParamNames.page,
        pageSize: pageSizeParamName = defaultPaginationParamNames.pageSize
    } = paramNames ?? {};

    const router = useRouter();
    const searchParams = useSearchParams();

    const setPaginationParam = (paramName: string, value: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramName, value.toString());
        router.push(`?${params.toString()}`);
    };

    const setPage = (page: number) => {
        setPaginationParam(pageParamName, page);
    };

    const setPageSize = (pageSize: number) => {
        setPaginationParam(pageSizeParamName, pageSize);
    };

    return {
        setPage,
        setPageSize
    };
}
