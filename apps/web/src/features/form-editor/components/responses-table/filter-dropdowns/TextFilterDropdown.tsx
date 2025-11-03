import { Stack, TextInput } from '@mantine/core';
import { DropdownControls } from './DropdownControls';
import { Header } from '@tanstack/react-table';
import { ResponseRow } from '../ResponsesTable';
import { useInputState } from '@mantine/hooks';

type Props = {
    header: Header<ResponseRow, unknown>;
    closeDropdown: () => void;
};

export function TextFilterDropdown({ header, closeDropdown }: Props) {
    const initialText = (header.column.getFilterValue() ?? '') as string;
    const [text, setText] = useInputState(initialText);

    const handleClear = () => {
        setText('');
        header.column.setFilterValue(undefined);
        closeDropdown();
    };

    const handleApply = () => {
        header.column.setFilterValue(text);
        closeDropdown();
    };

    return (
        <Stack gap='xs'>
            <TextInput placeholder='Filter...' onChange={setText} value={text} />
            <DropdownControls onClear={handleClear} onApply={handleApply} />
        </Stack>
    );
}
