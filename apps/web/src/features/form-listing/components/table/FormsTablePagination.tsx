import { Pagination } from '@mantine/core';
import { usePaginationParamSetter } from '../../hooks/usePaginationParamSetter';
import { PaginationMeta } from '../../lib/pagination';

type Props = {
    pagination: PaginationMeta;
};

export function FormsTablePagination({ pagination }: Props) {
    const { setPage } = usePaginationParamSetter();

    return (
        <Pagination
            total={pagination.totalPages}
            value={pagination.currentPage}
            onChange={setPage}
        />
    );
}
