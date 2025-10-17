'use client';

import { use } from 'react';
import { FormsTablePagination } from './FormsTablePagination';
import { Flex, Table } from '@mantine/core';
import { PaginatedFormsTableData } from '../../lib/data';
import { FormsTableBody } from './FormsTableBody';
import { FormsTableHeader } from './FormsTableHeader';

type Props = {
    formData: Promise<PaginatedFormsTableData>;
};

export function FormsTable({ formData }: Props) {
    const { data, pagination } = use(formData);

    return data.length > 0 ? (
        <Flex direction='column'>
            <Table verticalSpacing='sm'>
                <FormsTableHeader />
                <FormsTableBody data={data} />
            </Table>
            <Flex justify='flex-end' className='pt-sm'>
                <FormsTablePagination pagination={pagination} />
            </Flex>
        </Flex>
    ) : (
        'No forms found.'
    );
}
