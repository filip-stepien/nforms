'use client';

import { Flex } from '@mantine/core';
import { FormField } from './FormField';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useFormTitle } from '../../hooks/useFormTitle';
import { useFormCreateAction } from '../../hooks/useFormCreateAction';
import { useFormStatusEffect } from '../../hooks/useFormStatusEffect';
import { FormTitle } from './FormTitle';
import { FormControls } from './FormControls';
import { addField, reorderField } from '../../state/formFieldsSlice';
import { useFormDispatch } from '../../hooks/useFormDispatch';
import { useFormSelector } from '../../hooks/useFormSelector';

export function FormCreator() {
    const dispatch = useFormDispatch();
    const { title, onTitleChange, onTitleBlur } = useFormTitle();
    const fields = useFormSelector(state => state.formFields.fields);
    const { status, action, isLoading } = useFormCreateAction(title, fields);

    useFormStatusEffect(status);

    // const { fields, reorderField, addField } = useFormFieldsStore(
    //     useShallow(state => ({
    //         fields: state.fields,
    //         reorderField: state.reorderField,
    //         addField: state.addField
    //     }))
    // );

    return (
        <form action={action}>
            <DragDropContext
                onDragEnd={({ destination, source }) => {
                    dispatch(reorderField({ from: source.index, to: destination?.index }));
                }}
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
                                <FormField key={field.id} index={index} fieldId={field.id} />
                            ))}
                            {provided.placeholder}
                            <FormControls
                                addField={() => dispatch(addField())}
                                isLoading={isLoading}
                            />
                        </Flex>
                    )}
                </Droppable>
            </DragDropContext>
        </form>
    );
}
