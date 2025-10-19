import { Flex, Group } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { memo } from 'react';
import { ActionButton } from '../ui/ActionButton';
import { AddFieldButton } from './AddFieldButton';

type Props = {
    isLoading: boolean;
};

export const FormActions = memo(function FormActions({ isLoading }: Props) {
    return (
        <Group justify='center' className='mt-md relative w-full'>
            <Flex justify='center' flex={1}>
                <AddFieldButton />
            </Flex>
            <ActionButton
                label='Save'
                type='submit'
                icon={IconDeviceFloppy}
                loading={isLoading}
                className='absolute right-0'
            />
        </Group>
    );
});
