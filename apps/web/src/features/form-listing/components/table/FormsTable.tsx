import { use } from 'react';
import { FormsTablePagination } from './FormsTablePagination';
import { Flex, Skeleton, Stack, Table } from '@mantine/core';
import { FormTableData } from '../../lib/data';
import { FormsTableBody } from './FormsTableBody';
import { FormsTableHeader } from './FormsTableHeader';
import { Paginated } from '@/lib/pagination';
import { Empty } from '@/components/Empty';

type Props = {
    formData: Promise<Paginated<FormTableData[]>>;
};

export function FormsTable({ formData }: Props) {
    const { data, pagination } = use(formData);

    return data.length > 0 ? (
        <Flex direction='column'>
            <div className='overflow-x-auto'>
                <Table verticalSpacing='md'>
                    <FormsTableHeader />
                    <FormsTableBody data={data} />
                </Table>
            </div>
            <Flex justify='flex-end' className='pt-sm'>
                <FormsTablePagination pagination={pagination} />
            </Flex>
        </Flex>
    ) : (
        <Empty />
    );
}

FormsTable.Skeleton = function FormTableSkeleton() {
    return (
        <Stack>
            <Skeleton className='h-[450px]' />
            <Skeleton className='ml-auto h-[36px] w-1/3' />
        </Stack>
    );
};
