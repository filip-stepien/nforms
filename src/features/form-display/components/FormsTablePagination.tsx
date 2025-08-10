import { Pagination } from '@mantine/core';
import { usePaginationParamSetter } from '../hooks/usePaginationParamSetter';
import { PaginatedFormsTableData } from '../lib/data';
import { use } from 'react';

type Props = {
    formData: Promise<PaginatedFormsTableData>;
};

export function FormsTablePagination({ formData }: Props) {
    const { setPage } = usePaginationParamSetter();
    const data = use(formData);

    return (
        <Pagination
            total={data.pagination.totalPages}
            value={data.pagination.currentPage}
            onChange={setPage}
        />
    );
}
