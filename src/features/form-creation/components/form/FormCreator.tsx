'use client';

import { Button, Flex, TextInput } from '@mantine/core';
import { FormField } from './FormField';
import { FieldType, useFormFields } from '../../hooks/useFormFields';
import { DragDropContext, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';

export function FormCreator() {
    const { fields, addField, setField, deleteField, reorderField } = useFormFields([
        {
            id: 'xd',
            title: '',
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
                            label='Form title'
                            description='Enter a title for your form. This will be visible to respondents.'
                            placeholder='e.g. Customer Satisfaction Survey'
                        />
                        {fields.map((field, index) => (
                            <FormField
                                {...field}
                                key={field.id}
                                index={index}
                                onDelete={() => deleteField(field.id)}
                                onTitleChange={title => setField(field.id, { title })}
                                onFieldTypeChange={type => setField(field.id, { type })}
                                onSettingsChange={settings => setField(field.id, { settings })}
                                onControlsChange={controls => setField(field.id, { controls })}
                            />
                        ))}
                        {provided.placeholder}
                        <Button variant='transparent' className='mt-md' onClick={addField}>
                            + Add field
                        </Button>
                        <Button
                            variant='gradient'
                            className='mt-md'
                            onClick={() => console.log(fields)}
                        >
                            Finish
                        </Button>
                    </Flex>
                )}
            </Droppable>
        </DragDropContext>
    );
}
