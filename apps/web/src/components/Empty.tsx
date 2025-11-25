import { Center, Stack } from '@mantine/core';
import { Icon, IconCopyOff } from '@tabler/icons-react';

type Props = {
    title?: string;
    description?: string;
    icon?: Icon;
};

export function Empty({
    title = 'No data found',
    description = '',
    icon: Icon = IconCopyOff
}: Props) {
    return (
        <Center className='p-lg w-full'>
            <Stack align='center' gap='sm'>
                <Icon size={100} className='text-border' stroke={1} />
                <span className='text-font-tertiary text-lg font-bold'>{title}</span>
                <span className='text-font-tertiary text-sm'>{description}</span>
            </Stack>
        </Center>
    );
}
