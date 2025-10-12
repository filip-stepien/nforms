import { TextInput } from '@mantine/core';
import { ChangeEventHandler, FocusEventHandler, memo } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setTitle, initialTitle } from '../../state/slices/title';

export const FormTitle = memo(function FormTitle() {
    const dispatch = useAppDispatch();
    const title = useAppSelector(state => state.formTitle.title);

    const onTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(setTitle(event.target.value));
    };

    const onTitleBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            dispatch(setTitle(initialTitle));
        }
    };

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
