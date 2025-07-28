'use client';

import { Button, Stack, TextInput } from '@mantine/core';
import { FormField } from './FormField';

export function FormCreator() {
    return (
        <Stack gap='lg'>
            <TextInput
                label='Form title'
                description='Enter a title for your form. This will be visible to respondents.'
                placeholder='e.g. Customer Satisfaction Survey'
            />
            <FormField />
            <Button variant='transparent'>+ Add field</Button>
            <Button variant='gradient'>Finish</Button>
        </Stack>
    );
}
