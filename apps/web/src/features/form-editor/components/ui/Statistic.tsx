import { Skeleton, Stack } from '@mantine/core';
import { use } from 'react';

type Props = {
    value: Promise<number>;
    description: string;
};

export function Statistic({ value: valuePromise, description }: Props) {
    const value = use(valuePromise);

    return (
        <Stack gap={4} className='py-sm w-[160px] bg-white'>
            <span className='text-4xl'>{value}</span>
            <span className='text-sm'>{description}</span>
        </Stack>
    );
}

Statistic.Skeleton = function StatisticSkeleton() {
    return (
        <Stack gap={4} className='py-sm w-[160px]'>
            <Skeleton className='h-[40px] w-1/2' />
            <Skeleton className='h-[20px] w-full' />
        </Stack>
    );
};
