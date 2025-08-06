'use client';

import { Badge, Button, Flex, Group, Table } from '@mantine/core';
import dayjs from 'dayjs';
import {
    IconCalendarPlus,
    IconCode,
    IconEdit,
    IconLabel,
    IconProgress,
    IconSettings,
    IconUsers
} from '@tabler/icons-react';

const elements = [
    {
        id: '1',
        title: 'Untitled form',
        createdTimestamp: dayjs().unix(),
        status: 'Active',
        responsesCount: '54'
    },
    {
        id: '2',
        title: 'Untitled form',
        createdTimestamp: dayjs().unix(),
        status: 'Active',
        responsesCount: '54'
    },
    {
        id: '3',
        title: 'Untitled form',
        createdTimestamp: dayjs().unix(),
        status: 'Active',
        responsesCount: '54'
    }
];

export function FormsTable() {
    const rows = elements.map(e => (
        <Table.Tr key={e.id}>
            <Table.Td>
                <span className=''>{e.title}</span>
            </Table.Td>
            <Table.Td>
                <span className=''>{dayjs(e.createdTimestamp).format('DD.MM.YYYY')}</span>
            </Table.Td>
            <Table.Td>
                <Badge className='' color='blue' variant='light'>
                    {e.responsesCount}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Badge color='green' variant='dot'>
                    {e.status}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group>
                    <Button size='compact-sm' className='px-sm text-xs' variant='subtle'>
                        <Flex align='center' gap={6}>
                            <IconCode size={18} />
                            <span>Embed</span>
                        </Flex>
                    </Button>
                    <Button size='compact-sm' className='px-sm text-xs' variant='subtle'>
                        <Flex align='center' gap={6}>
                            <IconEdit size={18} />
                            <span>Edit</span>
                        </Flex>
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table verticalSpacing='sm'>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>
                        <Flex gap={6} align='center'>
                            <IconLabel size={16} className='text-icon' />
                            <span>Title</span>
                        </Flex>
                    </Table.Th>
                    <Table.Th>
                        <Flex gap={6} align='center'>
                            <IconCalendarPlus size={16} className='text-icon' />
                            <span>Created&nbsp;on</span>
                        </Flex>
                    </Table.Th>
                    <Table.Th>
                        <Flex gap={6} align='center'>
                            <IconUsers size={16} className='text-icon' />
                            <span>Responses</span>
                        </Flex>
                    </Table.Th>
                    <Table.Th>
                        <Flex gap={6} align='center'>
                            <IconProgress size={16} className='text-icon' />
                            <span>Status</span>
                        </Flex>
                    </Table.Th>
                    <Table.Th>
                        <Flex gap={6} align='center'>
                            <IconSettings size={16} className='text-icon' />
                            <span>Actions</span>
                        </Flex>
                    </Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}
