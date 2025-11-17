'use client';

import { use, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState
} from '@tanstack/react-table';
import { Table, Group, Stack, Pagination, Badge, Select } from '@mantine/core';
import { FilterButton } from './header-buttons/FilterButton';
import { SortButton } from './header-buttons/SortButton';
import dayjs, { Dayjs } from 'dayjs';
import Link from 'next/link';
import { IconExternalLink } from '@tabler/icons-react';
import { ActionButton } from '../ui/ActionButton';
import { Paginated } from '@/lib/pagination';
import { FormResponse } from '@packages/db/schemas/form-responses';
import { usePaginationParamSetter } from '@/hooks/usePaginationParamSetter';
import { Empty } from '@/components/Empty';

export type CategoryRow = { name: string; color: string };

export type ResponseRow = {
    email: string;
    submission: number;
    category: CategoryRow[];
    actionHref: string;
};

export type ResponseColumnFilterValues = {
    email: string;
    category: string[];
    dateRange: { from: Dayjs | null; to: Dayjs | null };
};

export type ResponseRowFilterType = keyof ResponseColumnFilterValues;

export type ResponseRowMeta = {
    filterType: ResponseRowFilterType;
};

type Props = {
    responses: Promise<Paginated<FormResponse[]>>;
};

function getRowsFromData(data: FormResponse[]): ResponseRow[] {
    return data.map(entry => ({
        email: entry.email ?? 'Anonymous',
        actionHref: '/response-details/' + entry.id,
        submission: dayjs(entry.submission).unix(),
        category: entry.categoryRules
            .filter(category => category.assigned)
            .map(({ category }) => category)
    }));
}

const columns: ColumnDef<ResponseRow>[] = [
    {
        accessorKey: 'email',
        header: 'Email',
        filterFn: 'includesString',
        meta: { filterType: 'email' }
    },
    {
        accessorKey: 'submission',
        header: 'Submission',
        meta: { filterType: 'dateRange' },
        cell: ctx => dayjs.unix(ctx.getValue<number>()).format('HH:mm DD.MM.YYYY'),
        filterFn: (row, columnId, { from, to }: ResponseColumnFilterValues['dateRange']) => {
            const timestampSec = row.getValue<number>(columnId);

            if (from && timestampSec < from.unix()) {
                return false;
            }

            if (to && timestampSec > to.unix()) {
                return false;
            }

            return true;
        }
    },
    {
        accessorKey: 'category',
        header: 'Category',
        meta: { filterType: 'category' },
        filterFn: (row, columnId, filterValue: string[]) => {
            if (!filterValue?.length) return true;
            const categories = row.getValue<CategoryRow[]>(columnId);
            const categoryNames = categories.map(c => c.name);
            return filterValue.every(f => categoryNames.includes(f));
        },
        cell: ctx => {
            const categories = ctx.getValue<CategoryRow[]>();
            return categories.length > 0 ? (
                <Group>
                    {categories.map((v, i) => (
                        <Badge key={i} color={v.color} variant='light'>
                            {v.name}
                        </Badge>
                    ))}
                </Group>
            ) : (
                <span className='italic'>{'<None>'}</span>
            );
        }
    },
    {
        accessorKey: 'actionHref',
        header: 'Actions',
        enableColumnFilter: false,
        enableSorting: false,
        cell: ctx => (
            <Link href={ctx.getValue<string>()}>
                <ActionButton
                    label='Details'
                    icon={IconExternalLink}
                    iconSize={18}
                    variant='transparent'
                    size='xs'
                    className='px-0'
                />
            </Link>
        )
    }
];

export function ResponsesTable({ responses }: Props) {
    const { setPage, setPageSize } = usePaginationParamSetter();
    const { data, pagination } = use(responses);
    const rows = getRowsFromData(data);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: rows,
        columns,
        pageCount: pagination.totalPages,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <Stack align='flex-end'>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Table.Tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <Table.Th key={header.id}>
                                    <Group gap={6} align='center' justify='space-between'>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        <Group gap={0}>
                                            {header.column.getCanFilter() && (
                                                <FilterButton header={header} />
                                            )}
                                            {header.column.getCanSort() && (
                                                <SortButton header={header} />
                                            )}
                                        </Group>
                                    </Group>
                                </Table.Th>
                            ))}
                        </Table.Tr>
                    ))}
                </Table.Thead>
                <Table.Tbody>
                    {table.getRowModel().rows.map(row => (
                        <Table.Tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <Table.Td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Table.Td>
                            ))}
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            {rows.length === 0 && <Empty />}
            <Group>
                <Pagination
                    total={pagination.totalPages}
                    value={pagination.currentPage}
                    onChange={setPage}
                />
                {rows.length > 0 && (
                    <Select
                        data={[
                            { label: '10 / page', value: '10' },
                            { label: '20 / page', value: '20' },
                            { label: '50 / page', value: '50' },
                            { label: '100 / page', value: '100' }
                        ]}
                        defaultValue='10'
                        value={String(pagination.pageSize)}
                        onChange={v => setPageSize(Number(v))}
                        className='w-[120px]'
                        allowDeselect={false}
                    />
                )}
            </Group>
        </Stack>
    );
}
