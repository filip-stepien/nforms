import { useRouter, useSearchParams } from 'next/navigation';

export function usePaginationParamSetter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const setPaginationParam = (paramName: string, value: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramName, value.toString());
        router.push(`?${params.toString()}`);
    };

    const setPage = (page: number) => {
        setPaginationParam('page', page);
    };

    const setPageSize = (pageSize: number) => {
        setPaginationParam('pageSize', pageSize);
    };

    return {
        setPage,
        setPageSize
    };
}
