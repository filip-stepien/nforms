import { Button, Group } from '@mantine/core';

type Props = {
    onApply: () => void;
    onClear: () => void;
};

export function DropdownControls({ onApply, onClear }: Props) {
    return (
        <Group gap='xs'>
            <Button size='xs' flex={1} onClick={onApply}>
                Apply
            </Button>
            <Button size='xs' flex={1} variant='light' onClick={onClear}>
                Clear
            </Button>
        </Group>
    );
}
