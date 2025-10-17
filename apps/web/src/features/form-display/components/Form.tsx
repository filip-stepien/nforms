'use client';

import { Button, Flex, Stack } from '@mantine/core';
import { ParsedForm } from '../lib/data';
import { FormQuestion } from './FormQuestion';
import { useDynamicFieldsForm } from '../hooks/useDynamicFieldsForm';

type Props = {
    parsedForm: ParsedForm;
};

export function Form({ parsedForm }: Props) {
    const { getInputProps, getKey, onSubmit } = useDynamicFieldsForm(parsedForm.fields);

    return (
        <form onSubmit={onSubmit(values => console.log(values))}>
            <Flex
                direction='column'
                align='center'
                gap='md'
                className='bg-neutral-background min-h-dvh'
            >
                <Stack className='sm:p-xl p-sm sm:gap-md gap-sm w-full sm:w-3/4 xl:w-1/2'>
                    <Stack className='bg-background shadow-card sm:p-xl p-lg sm:gap-lg h-fit w-full gap-1 rounded-md'>
                        <h1 className='text-xl font-medium sm:text-3xl'>{parsedForm.title}</h1>
                        <p className='sm:text-md text-sm'>Ten formularz opisuje coś tam</p>
                    </Stack>
                    {parsedForm.fields.map((field, index) => (
                        <FormQuestion
                            key={field.id}
                            index={index}
                            field={field}
                            formKey={getKey(field.id)}
                            inputProps={getInputProps(field.id)}
                        />
                    ))}
                    <Flex className='sm:gap-md gap-sm flex-col sm:flex-row sm:self-end'>
                        <Button className='order-1 sm:order-2' type='submit'>
                            Submit
                        </Button>
                    </Flex>
                </Stack>
            </Flex>
        </form>
    );
}
