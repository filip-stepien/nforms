'use client';

import { Flex, Group, TextInput } from '@mantine/core';
import { FormField } from './FormField';
import { FieldType, useFormFields } from '../../hooks/useFormFields';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useFormTitle } from '../../hooks/useFormTitle';
import { IconDeviceFloppy, IconPlaylistAdd } from '@tabler/icons-react';
import { ActionButton } from '../ui/ActionButton';

export function FormCreator() {
    const { title, onTitleChange, onTitleBlur } = useFormTitle();
    const { fields, addField, reorderField, getFormFieldProps } = useFormFields([
        {
            id: 'xd',
            title: 'Question title',
            type: FieldType.RATING,
            settings: {
                required: true
            },
            controls: {
                options: []
            }
        }
    ]);

    return (
        <DragDropContext
            onDragEnd={({ destination, source }) => reorderField(source.index, destination?.index)}
        >
            <Droppable droppableId='form-creator'>
                {provided => (
                    <Flex direction='column' ref={provided.innerRef} {...provided.droppableProps}>
                        <TextInput
                            value={title}
                            onChange={onTitleChange}
                            onBlur={onTitleBlur}
                            label='Form title'
                            description='Enter a title for your form. This will be visible to respondents.'
                            placeholder='Form title...'
                            size='md'
                            className='border-1 border-outline p-lg rounded-md bg-neutral-50'
                        />
                        {fields.map((field, index) => (
                            <FormField key={field.id} {...getFormFieldProps(field, index)} />
                        ))}
                        {provided.placeholder}
                        <Group justify='end' className='mt-md'>
                            <ActionButton
                                label='Add question'
                                variant='outline'
                                icon={IconPlaylistAdd}
                                onClick={addField}
                            />
                            <ActionButton
                                label='Save'
                                icon={IconDeviceFloppy}
                                onClick={() => console.log(fields)}
                            />
                        </Group>
                    </Flex>
                )}
            </Droppable>
        </DragDropContext>
    );
}
