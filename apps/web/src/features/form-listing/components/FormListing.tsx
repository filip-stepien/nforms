'use client';

import { Stack } from '@mantine/core';
import { Suspense } from 'react';
import { FormsTable } from './table/FormsTable';
import { Paginated } from '@/lib/pagination';
import { FormTableData } from '../lib/data';
import { SectionTitle } from '@/components/SectionTitle';
import { IconListDetails } from '@tabler/icons-react';

type Props = {
    suspenseKey: string;
    formData: Promise<Paginated<FormTableData[]>>;
};

export function FormListing({ suspenseKey, formData }: Props) {
    return (
        <Stack className='h-full'>
            <SectionTitle>
                <SectionTitle.Icon icon={IconListDetails} />
                <SectionTitle.Title>Your forms</SectionTitle.Title>
            </SectionTitle>
            <Suspense key={suspenseKey} fallback={<FormsTable.Skeleton />}>
                <FormsTable formData={formData} />
            </Suspense>
        </Stack>
    );
}
