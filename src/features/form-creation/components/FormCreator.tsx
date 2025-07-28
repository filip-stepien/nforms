'use client';

import { Button, Stack, TextInput } from '@mantine/core';
import { FormField, FormFieldRef } from './FormField';
import { createRef, RefObject, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

export function FormCreator() {
    const [fields, setFields] = useState<string[]>([]);
    const fieldRefs = useRef<RefObject<FormFieldRef | null>[]>([]);

    const addField = () => {
        const id = uuid();
        setFields(prev => [...prev, id]);
        fieldRefs.current.push(createRef<FormFieldRef>());
    };

    return (
        <Stack gap='lg'>
            <TextInput
                label='Form title'
                description='Enter a title for your form. This will be visible to respondents.'
                placeholder='e.g. Customer Satisfaction Survey'
            />

            {fields.map((id, i) => (
                <FormField key={id} ref={fieldRefs.current[i]} />
            ))}

            <Button variant='transparent' onClick={addField}>
                + Add field
            </Button>

            <Button
                variant='gradient'
                onClick={() => {
                    const data = fieldRefs.current.map(ref => ({
                        title: ref.current?.getTitle(),
                        type: ref.current?.getType(),
                        options: ref.current?.getOptions(),
                        settings: ref.current?.getSettings()
                    }));
                    console.log(data);
                }}
            >
                Finish
            </Button>
        </Stack>
    );
}
