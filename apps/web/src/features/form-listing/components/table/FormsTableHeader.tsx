import { Table, Flex } from '@mantine/core';
import {
    IconLabel,
    IconCalendarPlus,
    IconUsers,
    IconProgress,
    IconSettings,
    Icon
} from '@tabler/icons-react';

type FormTableHeading = {
    icon: Icon;
    label: string;
};

const HEADINGS: FormTableHeading[] = [
    {
        icon: IconLabel,
        label: 'Title'
    },
    {
        icon: IconCalendarPlus,
        label: 'Created on'
    },
    {
        icon: IconUsers,
        label: 'Responses'
    },
    {
        icon: IconProgress,
        label: 'Status'
    }
];

export function FormsTableHeader() {
    return (
        <Table.Thead>
            <Table.Tr>
                {HEADINGS.map(({ icon: Icon, label }) => (
                    <Table.Th key={label}>
                        <Flex gap={6} align='center'>
                            <Icon size={16} className='text-icon' />
                            <span>{label}</span>
                        </Flex>
                    </Table.Th>
                ))}
            </Table.Tr>
        </Table.Thead>
    );
}
