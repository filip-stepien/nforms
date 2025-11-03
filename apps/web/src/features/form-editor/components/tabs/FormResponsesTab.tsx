import { Flex, Stack } from '@mantine/core';
import { ResponsesChart } from '../charts/ResponsesChart';
import { CategoriesChart } from '../charts/CategoriesChart';
import { ResponsesTable } from '../responses-table/ResponsesTable';

type Props = {
    formId: string;
};

export function FormResponsesTab({ formId }: Props) {
    return (
        <Stack gap={50}>
            <Stack gap='lg'>
                <Flex>
                    <Stack gap={4} className='py-md w-[200px] bg-white'>
                        <span className='text-5xl'>123</span>
                        <span className='text-sm'>Total responses</span>
                    </Stack>
                    <Stack gap={4} className='py-md w-[200px] bg-white'>
                        <span className='text-5xl'>10</span>
                        <span className='text-sm'>Responses this week</span>
                    </Stack>
                </Flex>
                <Flex gap='xl'>
                    <Stack flex={1}>
                        <div className='font-bold'>Responses over time</div>
                        <ResponsesChart />
                    </Stack>
                    <div className='flex-1'>
                        <div className='pb-md font-bold'>Category distribution</div>
                        <Flex justify='center'>
                            <CategoriesChart />
                        </Flex>
                    </div>
                </Flex>
            </Stack>
            <ResponsesTable />
        </Stack>
    );
}
