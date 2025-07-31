'use client';

import { Button, Stack, TextInput } from '@mantine/core';
import { FormField } from './FormField';
import { FieldType, useFormFields } from '../../hooks/useFormFields';

export function FormCreator() {
    const { fields, addField, setField, deleteField } = useFormFields([
        {
            id: '',
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
        <Stack gap='lg'>
            <TextInput
                label='Form title'
                description='Enter a title for your form. This will be visible to respondents.'
                placeholder='e.g. Customer Satisfaction Survey'
            />
            {fields.map(({ id, title, type, settings, controls }) => (
                <FormField
                    key={id}
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
        </Stack>
    );
}
