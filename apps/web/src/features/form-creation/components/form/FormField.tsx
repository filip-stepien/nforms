import { Flex, NativeSelect, Stack, TextInput } from '@mantine/core';
import { ChangeEventHandler, FocusEventHandler, memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { IconTrash } from '@tabler/icons-react';
import { DragButton } from '../ui/DragButton';
import { IconButton } from '../ui/IconButton';
import { FieldSettings } from './FieldSettings';
import { FieldType, selectFieldById } from '../../state/slices/fields';
import { deleteField, setField } from '../../state/thunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { FieldControls } from './FieldControls';

type Props = {
    index: number;
    fieldId: string;
};

export const FormField = memo(function FormField({ index, fieldId }: Props) {
    const dispatch = useAppDispatch();
    const { title: fieldTitle, type: fieldType } = useAppSelector(state =>
        selectFieldById(state, fieldId)
    );

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(setField({ fieldId, field: { title: event.target.value } }));
    };

    const handleTitleBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            dispatch(setField({ fieldId, field: { title: 'Untitled question' } }));
        }
    };

    const handleInputTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
        dispatch(setField({ fieldId, field: { type: event.target.value as FieldType } }));
    };

    const handleDelete = () => {
        dispatch(deleteField({ fieldId }));
    };

    return (
        <Draggable draggableId={fieldId} index={index}>
            {provided => (
                <Flex
                    direction='column'
                    gap='sm'
                    className='p-lg pl-sm mt-sm rounded-md border-1 border-outline bg-neutral-100'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <Flex align='end' gap='sm'>
                        <DragButton
                            dragHandleProps={provided.dragHandleProps}
                            className='h-[36px]'
                        />
                        <TextInput
                            variant='unstyled'
                            placeholder='Question title...'
                            className='flex-1 border-b-1 border-outline font-semibold'
                            size='sm'
                            value={fieldTitle}
                            onChange={handleTitleChange}
                            onBlur={handleTitleBlur}
                        />
                        <FieldSettings fieldId={fieldId} />
                        <IconButton
                            icon={IconTrash}
                            variant='light'
                            color='red'
                            onClick={handleDelete}
                        />
                    </Flex>
                    <Stack className='ml-[calc(32px+1rem)]'>
                        <NativeSelect
                            label='Input type'
                            defaultValue={fieldType}
                            data={Object.values(FieldType)}
                            className='flex-1'
                            onChange={handleInputTypeChange}
                        />
                        <FieldControls fieldId={fieldId} />
                    </Stack>
                </Flex>
            )}
        </Draggable>
    );
});
