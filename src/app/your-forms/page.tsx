import { Loading } from '@/components/Loading';
import { FormsTable } from '@/features/form-display/components/FormsTable';
import { getFormsTableData } from '@/features/form-display/lib/data';
import { getPaginationSearchParams } from '@/features/form-display/lib/pagination';
import { Flex, Stack } from '@mantine/core';
import { IconLayout } from '@tabler/icons-react';
import { Suspense } from 'react';

type Props = {
    searchParams?: Promise<unknown>;
};

export default async function YourFormsPage({ searchParams }: Props) {
    const { page, pageSize } = getPaginationSearchParams(await searchParams);
    const formData = getFormsTableData({ page, pageSize });

    return (
        <Stack className='h-full'>
            <Flex align='center' gap='xs'>
                <IconLayout stroke={1.5} size={30} className='text-icon' />
                <h1 className='text-3xl font-medium text-font-secondary'>Your forms</h1>
            </Flex>
            <Suspense key={page + pageSize} fallback={<Loading />}>
                <FormsTable formData={formData} />
            </Suspense>
        </Stack>
    );
}
