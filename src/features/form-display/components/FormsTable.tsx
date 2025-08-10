'use client';

import { Flex, LoadingOverlay, Pagination, Table } from '@mantine/core';
import { PaginatedFormsTableData } from '../lib/data';
import { usePaginationParamSetter } from '../hooks/usePaginationParamSetter';
import { use } from 'react';
import { FormsTableHeader } from './FormsTableHeader';
import { FormsTableBody } from './FormsTableBody';

type Props = {
    formData: Promise<PaginatedFormsTableData>;
    loading?: boolean;
};

export function FormsTable({ formData, loading }: Props) {
    const { data, pagination } = use(formData);
    const { setPage } = usePaginationParamSetter();

    return (
        <Flex direction='column'>
            <LoadingOverlay visible={loading} />
            <Table verticalSpacing='sm'>
                <FormsTableHeader />
                <FormsTableBody data={data} />
            </Table>
            <Flex justify='flex-end' className='pt-sm'>
                <Pagination
                    total={pagination.totalPages}
                    value={pagination.currentPage}
                    onChange={setPage}
                />
            </Flex>
        </Flex>
    );
}
