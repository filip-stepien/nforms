import { IconPlus } from '@tabler/icons-react';
import { ActionButton } from '../ui/ActionButton';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { FieldType } from '@packages/db/schemas/form';
import { v4 as uuid } from 'uuid';
import { addField } from '../../state/fields';

export function AddFieldButton() {
    const dispatch = useAppDispatch();

    const handleAddField = () => {
        dispatch(addField({ id: uuid(), title: 'Untitled question', type: FieldType.TEXT }));
    };

    return (
        <ActionButton
            label='Add question'
            variant='transparent'
            icon={IconPlus}
            onClick={handleAddField}
        />
    );
}
