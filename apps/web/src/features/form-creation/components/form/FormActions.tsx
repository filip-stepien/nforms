import { Group } from '@mantine/core';
import { IconPlaylistAdd, IconDeviceFloppy } from '@tabler/icons-react';
import { memo } from 'react';
import { ActionButton } from '../ui/ActionButton';
import { addField } from '../../state/thunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { v4 as uuid } from 'uuid';
import { FieldType } from '@packages/db/schemas/form';

type Props = {
    isLoading: boolean;
};

export const FormActions = memo(function FormActions({ isLoading }: Props) {
    const dispatch = useAppDispatch();

    const handleAddField = () => {
        dispatch(addField({ id: uuid(), title: 'Untitled question', type: FieldType.TEXT }));
    };

    return (
        <Group justify='end' className='mt-md'>
            <ActionButton
                label='Add question'
                variant='outline'
                icon={IconPlaylistAdd}
                onClick={handleAddField}
            />
            <ActionButton label='Save' type='submit' icon={IconDeviceFloppy} loading={isLoading} />
        </Group>
    );
});
