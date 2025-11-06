import { MultiSelect, Stack } from '@mantine/core';
import { DropdownControls } from './DropdownControls';
import { Header } from '@tanstack/react-table';
import { ResponseColumnFilterValues, ResponseRow } from '../ResponsesTable';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

type Props = {
    header: Header<ResponseRow, unknown>;
    closeDropdown: () => void;
};

export function CategoryFilterDropdown({ header, closeDropdown }: Props) {
    const filterValue = header.column.getFilterValue() as
        | ResponseColumnFilterValues['category']
        | undefined;

    const initialSelected = filterValue ?? [];
    const [selected, setSelected] = useState<string[]>(initialSelected);
    const [opened, { toggle, close }] = useDisclosure(false);

    const handleClear = () => {
        setSelected([]);
        header.column.setFilterValue(undefined);
        closeDropdown();
    };

    const handleApply = () => {
        header.column.setFilterValue(selected);
        closeDropdown();
    };

    const handleSelectedChange = (value: string[]) => {
        setSelected(value);
        close();
    };

    return (
        <Stack gap='sm'>
            <MultiSelect
                data={['angry', 'not angry']}
                value={selected}
                onChange={handleSelectedChange}
                placeholder='Click to select...'
                comboboxProps={{ withinPortal: false }}
                dropdownOpened={opened}
                onClick={toggle}
                searchable
            />
            <DropdownControls onApply={handleApply} onClear={handleClear} />
        </Stack>
    );
}
