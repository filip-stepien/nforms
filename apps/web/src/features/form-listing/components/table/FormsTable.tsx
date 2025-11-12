import { use } from 'react';
import { FormsTablePagination } from './FormsTablePagination';
import { Flex, Table } from '@mantine/core';
import { FormTableData } from '../../lib/data';
import { FormsTableBody } from './FormsTableBody';
import { FormsTableHeader } from './FormsTableHeader';
import { Paginated } from '@/lib/pagination';

type Props = {
    formData: Promise<Paginated<FormTableData[]>>;
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
