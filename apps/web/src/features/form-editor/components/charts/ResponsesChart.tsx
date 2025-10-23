import { AreaChart } from '@mantine/charts';
import { Flex } from '@mantine/core';

const data = [
    {
        date: 'Mar 22',
        Apples: 2890,
        Oranges: 2338,
        Tomatoes: 2452
    },
    {
        date: 'Mar 23',
        Apples: 2756,
        Oranges: 2103,
        Tomatoes: 2402
    },
    {
        date: 'Mar 24',
        Apples: 3322,
        Oranges: 986,
        Tomatoes: 1821
    },
    {
        date: 'Mar 25',
        Apples: 3470,
        Oranges: 2108,
        Tomatoes: 2809
    },
    {
        date: 'Mar 26',
        Apples: 3129,
        Oranges: 1726,
        Tomatoes: 2290
    }
];

export function ResponsesChart() {
    return (
        <Flex flex={1} className='w-1/2'>
            <AreaChart
                h={200}
                data={data}
                dataKey='date'
                series={[{ name: 'Oranges', color: 'blue.6' }]}
                curveType='linear'
            />
        </Flex>
    );
}
