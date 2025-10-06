import { TextInput } from '@mantine/core';
import { ChangeEventHandler, FocusEventHandler, memo } from 'react';

type Props = {
    title: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onBlur: FocusEventHandler<HTMLInputElement>;
};

export const FormTitle = memo(function FormTitle({ onChange, onBlur, title }: Props) {
    return (
        <TextInput
            value={title}
            onChange={onChange}
            onBlur={onBlur}
            label='Form title'
            description='Enter a title for your form. This will be visible to respondents.'
            placeholder='Form title...'
            size='md'
            className='border-1 border-outline p-lg rounded-md bg-neutral-50'
        />
    );
});
