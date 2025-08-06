import { FormsTable } from '@/features/form-display/components/FormsTable';
import { getFormsTableData } from '@/features/form-display/lib/data';
import { getPaginationSearchParams } from '@/features/form-display/lib/pagination';
import { Flex, Stack } from '@mantine/core';
import { IconLayout } from '@tabler/icons-react';

type Props = {
    searchParams?: Promise<unknown>;
};

export default async function YourFormsPage({ searchParams }: Props) {
    const paginationParams = getPaginationSearchParams(await searchParams);
    const { data, pagination } = await getFormsTableData(paginationParams);

    return (
        <Stack>
            <Flex align='center' gap='xs'>
                <IconLayout stroke={1.5} size={30} className='text-icon' />
                <h1 className='text-3xl font-medium text-font-secondary'>Your forms</h1>
            </Flex>
            <FormsTable data={data} pagination={pagination} />
        </Stack>
    );
}
