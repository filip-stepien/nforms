import { Table, Flex } from '@mantine/core';
import {
    IconLabel,
    IconCalendarPlus,
    IconUsers,
    IconProgress,
    IconSettings
} from '@tabler/icons-react';

export function FormsTableHeader() {
    return (
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
    );
}
