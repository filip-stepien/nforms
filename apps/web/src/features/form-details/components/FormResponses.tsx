import {
    Accordion,
    Badge,
    Notification,
    Divider,
    Flex,
    Group,
    Pagination,
    Stack,
    Table,
    TreeNodeData,
    Tree
} from '@mantine/core';
import { ResponsesChart } from './ResponsesChart';
import { IconAlertTriangleFilled, IconCheck } from '@tabler/icons-react';

type Props = {
    formId: string;
};

const tree: TreeNodeData[] = [
    {
        label: (
            <Notification
                withCloseButton={false}
                color='red'
                title='Sentiment is NEGATIVE AND Emotion is ANGER'
                className='mb-xs w-fit shadow-xs'
            />
        ),
        value: '1',
        children: [
            {
                label: (
                    <Notification
                        withCloseButton={false}
                        color='red'
                        title='Detected sentiment is NEGATIVE'
                        className='mb-xs w-fit shadow-xs'
                    >
                        Sentiment was marked as POSITIVE.
                    </Notification>
                ),
                value: '2'
            },
            {
                label: (
                    <Notification
                        withCloseButton={false}
                        color='red'
                        title='Detected sentiment is NEGATIVE'
                        className='mb-xs w-fit shadow-xs'
                    >
                        Sentiment was marked as POSITIVE.
                    </Notification>
                ),
                value: '3'
            }
        ]
    },
    {
        label: (
            <Notification
                withCloseButton={false}
                color='red'
                title='Detected sentiment is NEGATIVE'
                className='mb-xs w-fit shadow-xs'
            >
                Sentiment was marked as POSITIVE.
            </Notification>
        ),
        value: '4',
        children: [
            {
                label: (
                    <Notification
                        withCloseButton={false}
                        color='red'
                        title='Detected sentiment is NEGATIVE'
                        className='mb-xs w-fit shadow-xs'
                    >
                        Sentiment was marked as POSITIVE.
                    </Notification>
                ),
                value: '5'
            },
            {
                label: (
                    <Notification
                        withCloseButton={false}
                        color='red'
                        title='Detected sentiment is NEGATIVE'
                        className='mb-xs w-fit shadow-xs'
                    >
                        Sentiment was marked as POSITIVE.
                    </Notification>
                ),
                value: '6'
            }
        ]
    }
];

export function FormResponses({ formId }: Props) {
    return (
        <Stack gap={50}>
            <Stack gap='lg'>
                <Stack className='gap-xxs'>
                    <span className='text-xl font-bold'>Statistics</span>
                    <Divider className='m-0' />
                </Stack>
                <Group gap={50}>
                    <Stack gap={4}>
                        <span className='text-5xl'>123</span>
                        <span className='text-sm'>Total responses</span>
                    </Stack>
                    <Stack gap={4}>
                        <span className='text-5xl'>10</span>
                        <span className='text-sm'>This week</span>
                    </Stack>
                </Group>
                <ResponsesChart />
            </Stack>
            <Stack gap='lg'>
                <Stack className='gap-xxs'>
                    <span className='text-xl font-bold'>Responses</span>
                    <Divider className='m-0' />
                </Stack>
                <Flex justify='space-between'>
                    <Table variant='vertical' layout='fixed' withTableBorder className='w-1/2'>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th w={160} className='font-bold'>
                                    Response number
                                </Table.Th>
                                <Table.Td>1</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th w={160} className='font-bold'>
                                    Respondent
                                </Table.Th>
                                <Table.Td>example@example.com</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th className='font-bold'>Submission</Table.Th>
                                <Table.Td>19:15 20.10.2025</Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                    <Flex align='flex-end'>
                        <Pagination total={10} />
                    </Flex>
                </Flex>

                <Accordion multiple={true} variant='contained'>
                    <Accordion.Item value='panel1'>
                        <Accordion.Control>
                            <Stack gap='xs'>
                                <div className='text-xs font-bold'>
                                    1. How would you describe your overall experience using our
                                    platform over the past month?
                                </div>
                                <span className='pt-sm'>
                                    Overall, the experience has been very positive. The interface
                                    feels smooth and intuitive, and the recent performance
                                    improvements made a noticeable difference.
                                </span>
                            </Stack>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack>
                                <Flex gap='xs'>
                                    <Badge
                                        color='green'
                                        size='md'
                                        className='flex items-center pt-0.5'
                                        leftSection={
                                            <IconCheck color='white' size={18} className='pb-0.5' />
                                        }
                                    >
                                        This response is consistent
                                    </Badge>
                                </Flex>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value='panel2'>
                        <Accordion.Control>
                            <Stack gap='xs'>
                                <div className='text-xs font-bold'>
                                    2. How would you describe your overall experience using our
                                    platform over the past month?
                                </div>
                                <span className='pt-sm'>
                                    Overall, the experience has been very positive. The interface
                                    feels smooth and intuitive, and the recent performance
                                    improvements made a noticeable difference.
                                </span>
                            </Stack>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap='xs'>
                                <Badge
                                    color='red'
                                    size='md'
                                    className='flex items-center pt-0.5'
                                    leftSection={
                                        <IconAlertTriangleFilled
                                            color='white'
                                            size={18}
                                            className='pb-0.5'
                                        />
                                    }
                                >
                                    This response is inconsistent
                                </Badge>
                                <Tree data={tree} />
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value='panel3'>
                        <Accordion.Control>
                            <Stack gap='xs'>
                                <div className='text-xs font-bold'>
                                    3. How would you describe your overall experience using our
                                    platform over the past month?
                                </div>
                                <span className='pt-sm'>
                                    Overall, the experience has been very positive. The interface
                                    feels smooth and intuitive, and the recent performance
                                    improvements made a noticeable difference.
                                </span>
                            </Stack>
                        </Accordion.Control>
                    </Accordion.Item>
                </Accordion>
            </Stack>
        </Stack>
    );
}
