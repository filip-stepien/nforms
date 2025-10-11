'use client';

import { Flex } from '@mantine/core';
import { FormField } from './FormField';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useFormCreateAction } from '../../hooks/useFormCreateAction';
import { useFormStatusEffect } from '../../hooks/useFormStatusEffect';
import { FormTitle } from './FormTitle';
import { FormActions } from './FormActions';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { reorderField } from '../../state/slices/fields';

export function FormCreator() {
    const { status, action, isLoading } = useFormCreateAction();
    const fields = useAppSelector(state => state.formFields);
    const dispatch = useAppDispatch();

    useFormStatusEffect(status);

    const handleDragEnd = ({ source, destination }: DropResult) => {
        dispatch(reorderField({ from: source.index, to: destination?.index }));
    };

    return (
        <form action={action}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='form-creator'>
                    {provided => (
                        <Flex
                            direction='column'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <FormTitle />
                            {fields.map((field, index) => (
                                <FormField key={field.id} index={index} fieldId={field.id} />
                            ))}
                            {provided.placeholder}
                            <FormActions isLoading={isLoading} />
                        </Flex>
                    )}
                </Droppable>
            </DragDropContext>
        </form>
    );
}
