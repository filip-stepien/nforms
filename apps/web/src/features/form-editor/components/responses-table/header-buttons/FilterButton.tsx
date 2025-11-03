import { Popover, ActionIcon } from '@mantine/core';
import { IconFilter, ReactNode } from '@tabler/icons-react';
import { Header } from '@tanstack/react-table';
import { ResponseRow, ResponseRowFilterType, ResponseRowMeta } from '../ResponsesTable';
import { TextFilterDropdown } from '../filter-dropdowns/TextFilterDropdown';
import { DateTimeRangeFilterDropdown } from '../filter-dropdowns/DateTimeRangeFilterDropdown';
import { SelectFilterDropdown } from '../filter-dropdowns/SelectFilterDropdown';
import { useDisclosure } from '@mantine/hooks';

type Props = {
    header: Header<ResponseRow, unknown>;
};

export function FilterButton({ header }: Props) {
    const [opened, { toggle, close }] = useDisclosure(false);

    const columnMeta = header.column.columnDef.meta as ResponseRowMeta;
    const dropdowns: Record<ResponseRowFilterType, ReactNode> = {
        text: <TextFilterDropdown header={header} closeDropdown={close} />,
        select: <SelectFilterDropdown header={header} closeDropdown={close} />,
        dateRange: <DateTimeRangeFilterDropdown header={header} closeDropdown={close} />
    };

    return (
        <Popover
            trapFocus
            width={200}
            position='bottom-end'
            shadow='md'
            classNames={{ dropdown: '!w-[300px]' }}
            opened={opened}
            onDismiss={close}
        >
            <Popover.Target>
                <ActionIcon
                    variant='subtle'
                    className={header.column.getIsFiltered() ? 'text-blue' : 'text-font-tertiary'}
                    onClick={toggle}
                >
                    <IconFilter size={16} />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>{dropdowns[columnMeta.filterType]}</Popover.Dropdown>
        </Popover>
    );
}
