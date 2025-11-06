import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState
} from '@tanstack/react-table';
import { Table, Group, Stack, Pagination, Badge } from '@mantine/core';
import { FilterButton } from './header-buttons/FilterButton';
import { SortButton } from './header-buttons/SortButton';
import dayjs, { Dayjs } from 'dayjs';

export type CategoryRow = { name: string; color: string };

export type ResponseRow = {
    email: string;
    submission: number;
    category: CategoryRow[];
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

const data: ResponseRow[] = [
    {
        email: 'a@a.com',
        submission: 1762190488,
        category: [
            { name: 'angry', color: 'red' },
            { name: 'not angry', color: 'green' }
        ]
    },
    {
        email: 'b@b.com',
        submission: 1762190488,
        category: [{ name: 'angry', color: 'red' }]
    },
    {
        email: 'c@c.com',
        submission: 1762190488,
        category: [
            { name: 'angry', color: 'red' },
            { name: 'not angry', color: 'green' }
        ]
    },
    {
        email: 'a@a.com',
        submission: 1762190488,
        category: [{ name: 'angry', color: 'red' }]
    },
    {
        email: 'b@b.com',
        submission: 1762190488,
        category: [{ name: 'angry', color: 'red' }]
    },
    {
        email: 'c@c.com',
        submission: 1762190488,
        category: [
            { name: 'angry', color: 'red' },
            { name: 'not angry', color: 'green' }
        ]
    }
];

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
        cell: ctx => (
            <Group>
                {ctx.getValue<CategoryRow[]>().map((v, i) => (
                    <Badge key={i} color={v.color}>
                        {v.name}
                    </Badge>
                ))}
            </Group>
        )
    }
];

export function ResponsesTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel()
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
                                            <FilterButton header={header} />
                                            <SortButton header={header} />
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
            <Pagination total={100} />
        </Stack>
    );
}
