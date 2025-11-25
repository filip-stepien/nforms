import { Flex, Group, Stack } from '@mantine/core';
import { ResponsesChart } from '../charts/ResponsesChart';
import { CategoriesChart } from '../charts/CategoriesChart';
import { ResponsesTable } from '../responses-table/ResponsesTable';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { Paginated } from '@/lib/pagination';
import { Suspense } from 'react';
import { CategoriesChartData, ResponsesChartData } from '../../lib/data';
import { Statistic } from '../ui/Statistic';

type Props = {
    responses: Promise<Paginated<FormResponse[]>>;
    categoriesChartData: Promise<CategoriesChartData[]>;
    responsesChartData: Promise<ResponsesChartData[]>;
    totalResponses: Promise<number>;
    thisWeekResponses: Promise<number>;
    suspenseKey: string;
};

export function FormResponsesTab(props: Props) {
    const {
        responses,
        suspenseKey,
        categoriesChartData,
        responsesChartData,
        totalResponses,
        thisWeekResponses
    } = props;

    return (
        <Stack>
            <Stack gap='lg'>
                <Group gap='sm'>
                    <Suspense fallback={<Statistic.Skeleton />}>
                        <Statistic value={totalResponses} description='Total responses' />
                    </Suspense>
                    <Suspense fallback={<Statistic.Skeleton />}>
                        <Statistic value={thisWeekResponses} description='Responses this week' />
                    </Suspense>
                </Group>
                <Flex gap='xl' className='min-w-0 flex-col lg:flex-row'>
                    <Stack flex={1} className='min-w-0'>
                        <div className='font-bold'>Responses over time</div>
                        <Suspense fallback={<ResponsesChart.Skeleton />}>
                            <ResponsesChart responsesChartData={responsesChartData} />
                        </Suspense>
                    </Stack>
                    <div className='min-w-0 flex-1'>
                        <div className='pb-md font-bold'>Category distribution</div>
                        <Suspense fallback={<CategoriesChart.Skeleton />}>
                            <CategoriesChart categoriesChartData={categoriesChartData} />
                        </Suspense>
                    </div>
                </Flex>
            </Stack>
            <Suspense key={suspenseKey} fallback={<ResponsesTable.Skeleton />}>
                <Stack>
                    <div className='font-bold'>Responses</div>
                    <ResponsesTable responses={responses} />
                </Stack>
            </Suspense>
        </Stack>
    );
}
