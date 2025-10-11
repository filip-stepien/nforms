import { TextInput } from '@mantine/core';
import { useFormTitle } from '../../hooks/useFormTitle';
import { memo } from 'react';

export const FormTitle = memo(function FormTitle() {
    const { title, onTitleChange, onTitleBlur } = useFormTitle();

    return (
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
    );
});
