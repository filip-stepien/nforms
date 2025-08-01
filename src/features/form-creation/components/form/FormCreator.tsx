'use client';

import { Button, Flex, Stack, TextInput } from '@mantine/core';
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

    const handleFieldDragEnd: OnDragEndResponder<string> = ({ destination, source }) => {
        reorderField(source.index, destination?.index ?? source.index);
    };

    return (
        <DragDropContext onDragEnd={handleFieldDragEnd}>
            <Droppable droppableId='form-creator'>
                {provided => (
                    <Flex direction='column' ref={provided.innerRef} {...provided.droppableProps}>
                        <TextInput
                            label='Form title'
                            description='Enter a title for your form. This will be visible to respondents.'
                            placeholder='e.g. Customer Satisfaction Survey'
                        />
                        {fields.map(({ id, title, type, settings, controls }, index) => (
                            <FormField
                                key={id}
                                id={id}
                                index={index}
                                title={title}
                                fieldType={type}
                                settings={settings}
                                controls={controls}
                                onDelete={() => deleteField(id)}
                                onTitleChange={title => setField(id, { title })}
                                onFieldTypeChange={type => setField(id, { type })}
                                onSettingsChange={settings => setField(id, { settings })}
                                onControlsChange={controls => setField(id, { controls })}
                            />
                        ))}
                        {provided.placeholder}
                        <Button variant='transparent' onClick={addField}>
                            + Add field
                        </Button>
                        <Button
                            variant='gradient'
                            onClick={() => {
                                console.log(fields);
                            }}
                        >
                            Finish
                        </Button>
                    </Flex>
                )}
            </Droppable>
        </DragDropContext>
    );
}
