import { Loading } from '@/components/Loading';
import { Stack, Flex } from '@mantine/core';
import { IconLayout } from '@tabler/icons-react';
import { Suspense } from 'react';
import { FormsTable } from './table/FormsTable';
import { Paginated } from '@/lib/pagination';
import { FormTableData } from '../lib/data';

type Props = {
    suspenseKey: string;
    formData: Promise<Paginated<FormTableData[]>>;
};

export function FormListing({ suspenseKey, formData }: Props) {
    return (
        <Stack className='h-full'>
            <Flex align='center' gap='xs'>
                <IconLayout stroke={1.5} size={30} className='text-icon' />
                <h1 className='text-font-secondary text-3xl font-medium'>Your forms</h1>
            </Flex>
            <Suspense key={suspenseKey} fallback={<Loading />}>
                <FormsTable formData={formData} />
            </Suspense>
        </Stack>
    );
}
