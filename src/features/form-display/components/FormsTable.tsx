'use client';

import { Badge, Button, Flex, Group, Pagination, Table } from '@mantine/core';
import { FormTableData } from '../lib/data';
import { PaginationMeta } from '../lib/pagination';
import { usePaginationParamSetter } from '../hooks/usePaginationParamSetter';
import {
    IconCalendarPlus,
    IconCode,
    IconEdit,
    IconLabel,
    IconProgress,
    IconSettings,
    IconUsers
} from '@tabler/icons-react';

type Props = {
    data: FormTableData[];
    pagination: PaginationMeta;
};

export function FormsTable({ data, pagination }: Props) {
    const { setPage } = usePaginationParamSetter();

    const rows = data.map(form => (
        <Table.Tr key={form.id}>
            <Table.Td>
                <span className=''>{form.title}</span>
            </Table.Td>
            <Table.Td>
                <span className=''>{form.createdOn}</span>
            </Table.Td>
            <Table.Td>
                <Badge className='' color='blue' variant='light'>
                    {form.responses}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Badge color='green' variant='dot'>
                    {form.status}
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

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    return (
        <Flex direction='column'>
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
            <Pagination
                total={pagination.totalPages}
                value={pagination.currentPage}
                onChange={handlePageChange}
            />
        </Flex>
    );
}
