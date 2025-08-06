import { FormsTable } from '@/features/form-display/components/FormsTable';
import { Flex, Stack } from '@mantine/core';
import { IconLayout } from '@tabler/icons-react';

export default function YourFormsPage() {
    return (
        <Stack>
            <Flex align='center' gap='xs'>
                <IconLayout stroke={1.5} size={30} className='text-icon' />
                <h1 className='text-3xl font-medium text-font-secondary'>Your forms</h1>
            </Flex>
            <FormsTable />
        </Stack>
    );
}
