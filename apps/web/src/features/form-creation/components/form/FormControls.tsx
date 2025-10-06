import { Group } from '@mantine/core';
import { IconPlaylistAdd, IconDeviceFloppy } from '@tabler/icons-react';
import { memo } from 'react';
import { ActionButton } from '../ui/ActionButton';

type Props = {
    addField: () => void;
    isLoading: boolean;
};

export const FormControls = memo(function FormControls({ addField, isLoading }: Props) {
    return (
        <Group justify='end' className='mt-md'>
            <ActionButton
                label='Add question'
                variant='outline'
                icon={IconPlaylistAdd}
                onClick={addField}
            />
            <ActionButton label='Save' type='submit' icon={IconDeviceFloppy} loading={isLoading} />
        </Group>
    );
});
