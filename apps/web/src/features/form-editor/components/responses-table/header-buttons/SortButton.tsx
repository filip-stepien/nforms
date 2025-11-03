import { Header } from '@tanstack/react-table';
import { ResponseRow } from '../ResponsesTable';
import { IconSortAscending, IconSortDescending, IconArrowsSort } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';

type Props = {
    header: Header<ResponseRow, unknown>;
};

export function SortButton({ header }: Props) {
    const sorted = header.column.getIsSorted();
    const icon =
        sorted === 'asc' ? (
            <IconSortAscending size={16} />
        ) : sorted === 'desc' ? (
            <IconSortDescending size={16} />
        ) : (
            <IconArrowsSort size={16} />
        );

    return (
        <ActionIcon
            variant='subtle'
            className={sorted === false ? 'text-font-tertiary' : 'blue'}
            onClick={header.column.getToggleSortingHandler()}
        >
            {icon}
        </ActionIcon>
    );
}
