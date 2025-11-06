import { Popover, ActionIcon } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { Header } from '@tanstack/react-table';
import { ResponseRow } from '../ResponsesTable';
import { useDisclosure } from '@mantine/hooks';
import { FilterDropdown } from '../filter-dropdowns/FilterDropdown';

type Props = {
    header: Header<ResponseRow, unknown>;
};

export function FilterButton({ header }: Props) {
    const [opened, { toggle, close }] = useDisclosure(false);

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
            <Popover.Dropdown>
                <FilterDropdown header={header} closeDropdown={close} />
            </Popover.Dropdown>
        </Popover>
    );
}
