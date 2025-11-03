import { MultiSelect, Stack } from '@mantine/core';
import { DropdownControls } from './DropdownControls';
import { Header } from '@tanstack/react-table';
import { ResponseRow } from '../ResponsesTable';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

type Props = {
    header: Header<ResponseRow, unknown>;
    closeDropdown: () => void;
};

export function SelectFilterDropdown({ header, closeDropdown }: Props) {
    const initialSelected = (header.column.getFilterValue() ?? []) as string[];
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
                placeholder='Click or type to select...'
                comboboxProps={{ withinPortal: false }}
                hidePickedOptions
                dropdownOpened={opened}
                onClick={toggle}
                searchable
            />
            <DropdownControls onApply={handleApply} onClear={handleClear} />
        </Stack>
    );
}
