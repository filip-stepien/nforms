import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { reorderField, selectFields } from '../../state/slices/fields';
import { Flex } from '@mantine/core';
import { FormField } from './FormField';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { memo } from 'react';

export const FormFieldsContainer = memo(function FormFieldsContainer() {
    const fields = useAppSelector(state => selectFields(state));
    const dispatch = useAppDispatch();

    const handleDragEnd = ({ source, destination }: DropResult) => {
        dispatch(reorderField({ from: source.index, to: destination?.index }));
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='form-creator'>
                {provided => (
                    <Flex direction='column' ref={provided.innerRef} {...provided.droppableProps}>
                        {fields.map((field, index) => (
                            <FormField key={field.id} index={index} fieldId={field.id} />
                        ))}
                        {provided.placeholder}
                    </Flex>
                )}
            </Droppable>
        </DragDropContext>
    );
});
