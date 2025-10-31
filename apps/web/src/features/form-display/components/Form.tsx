'use client';

import { Button, Flex, Stack } from '@mantine/core';
import { ParsedForm, RawFieldResponse } from '../lib/data';
import { FormQuestion } from './FormQuestion';
import { useDynamicFieldsForm } from '../hooks/useDynamicFieldsForm';
import { useState, useTransition } from 'react';
import { SubmitCheck } from './SubmitCheck';
import { TextInput as MantineTextInput } from '@mantine/core';
import { saveFormResponseAction } from '../lib/actions';

type Props = {
    form: ParsedForm;
};

export function Form({ form }: Props) {
    const { id, fields, title, settings, description } = form;
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { getInputProps, getInputKey, emailKey, emailProps, onSubmit } =
        useDynamicFieldsForm(fields);

    const handleSubmit = onSubmit(async values => {
        const { email, ...restValues } = values;

        const responses: RawFieldResponse[] = Object.entries(restValues).map(
            ([fieldId, response]) => ({
                fieldId,
                fieldType: fields.find(f => f.id === fieldId)!.type,
                response: response as string
            })
        );

        startTransition(async () => {
            try {
                await saveFormResponseAction(id, responses, email as string | undefined);
                setSubmitted(true);
            } catch {
                setError(true);
            }
        });
    });

    if (error) {
        return 'err';
    }

    if (submitted) {
        return <SubmitCheck />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <Flex
                direction='column'
                align='center'
                gap='md'
                className='bg-neutral-background min-h-dvh'
            >
                <Stack className='sm:p-xl p-sm sm:gap-md gap-sm w-full sm:w-3/4 xl:w-1/2'>
                    <Stack className='bg-background shadow-card sm:p-xl p-lg sm:gap-lg h-fit w-full gap-1 rounded-md'>
                        <h1 className='text-xl font-medium sm:text-3xl'>{title}</h1>
                        {description && (
                            <p className='sm:text-md text-justify text-sm'>{description}</p>
                        )}
                        {settings.anonymous ? (
                            <span className='text-font-tertiary text-md'>
                                This form is anonymous.
                            </span>
                        ) : (
                            <MantineTextInput
                                key={emailKey}
                                label='Your email'
                                placeholder='Enter your email...'
                                description='This email is used to identify you as a respondent. It won’t be shared publicly.'
                                withAsterisk
                                classNames={{
                                    input: 'border-0 placeholder:text-placeholder text-foreground',
                                    wrapper: 'border-b-1 border-border',
                                    error: 'pt-xs'
                                }}
                                {...emailProps}
                            />
                        )}
                    </Stack>
                    {fields.map((field, index) => (
                        <FormQuestion
                            key={field.id}
                            index={index}
                            field={field}
                            formKey={getInputKey(field.id)}
                            inputProps={getInputProps(field.id)}
                        />
                    ))}
                    <Flex className='gap-sm flex-col sm:flex-row sm:gap-0 sm:self-end'>
                        <Button type='submit' loading={isPending}>
                            Submit
                        </Button>
                    </Flex>
                </Stack>
            </Flex>
        </form>
    );
}
