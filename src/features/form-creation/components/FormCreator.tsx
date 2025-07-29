'use client';

import { Button, Stack, TextInput } from '@mantine/core';
import { FormField } from './FormField';
import { useDynamicFormFields } from '../hooks/useDynamicFormFields';

export function FormCreator() {
    const { fields, getFieldData, addField, deleteField } = useDynamicFormFields();

    return (
        <Stack gap='lg'>
            <TextInput
                label='Form title'
                description='Enter a title for your form. This will be visible to respondents.'
                placeholder='e.g. Customer Satisfaction Survey'
            />
            {fields.map(({ id, ref }) => (
                <FormField key={id} ref={ref} onDelete={() => deleteField(id)} />
            ))}
            <Button variant='transparent' onClick={addField}>
                + Add field
            </Button>
            <Button
                variant='gradient'
                onClick={() => {
                    console.log(getFieldData());
                }}
            >
                Finish
            </Button>
        </Stack>
    );
}
