'use client';

import { Flex } from '@mantine/core';
import { FormField } from './FormField';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useFormTitle } from '../../hooks/useFormTitle';
import { useFormCreateAction } from '../../hooks/useFormCreateAction';
import { useFormStatusEffect } from '../../hooks/useFormStatusEffect';
import { useFormFieldsStore } from '../../hooks/useFormFieldsStore';
import { FormTitle } from './FormTitle';
import { FormControls } from './FormControls';
import { useShallow } from 'zustand/shallow';

export function FormCreator() {
    const { title, onTitleChange, onTitleBlur } = useFormTitle();
    const { fields, reorderField, addField } = useFormFieldsStore(
        useShallow(state => ({
            fields: state.fields,
            reorderField: state.reorderField,
            addField: state.addField
        }))
    );

    const { status, action, isLoading } = useFormCreateAction(title, fields);

    useFormStatusEffect(status);

    return (
        <form action={action}>
            <DragDropContext
                onDragEnd={({ destination, source }) =>
                    reorderField(source.index, destination?.index)
                }
            >
                <Droppable droppableId='form-creator'>
                    {provided => (
                        <Flex
                            direction='column'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <FormTitle
                                title={title}
                                onChange={onTitleChange}
                                onBlur={onTitleBlur}
                            />
                            {fields.map((field, index) => (
                                <FormField key={field.id} index={index} field={field} />
                            ))}
                            {provided.placeholder}
                            <FormControls addField={addField} isLoading={isLoading} />
                        </Flex>
                    )}
                </Droppable>
            </DragDropContext>
        </form>
    );
}
