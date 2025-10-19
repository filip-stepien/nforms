import { Group, Textarea, TextInput } from '@mantine/core';
import { ChangeEventHandler, FocusEventHandler, memo } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setFormTitle, initialTitle, setFormDescription } from '../../state/slices/form';

export const FormHeader = memo(function FormHeader() {
    const dispatch = useAppDispatch();
    const title = useAppSelector(state => state.form.title);
    const description = useAppSelector(state => state.form.description);

    const onTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(setFormTitle(event.target.value));
    };

    const onTitleBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            dispatch(setFormTitle(initialTitle));
        }
    };

    const onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
        dispatch(setFormDescription(event.target.value));
    };

    return (
        <>
            <TextInput
                value={title}
                onChange={onTitleChange}
                onBlur={onTitleBlur}
                label={<span className='font-bold'>Form title</span>}
                description='Enter a title for your form. This will be visible to respondents.'
                placeholder='Form title...'
                size='md'
            />

            <Textarea
                value={description}
                onChange={onDescriptionChange}
                label={
                    <Group gap={6}>
                        {<span className='font-bold'>Form description</span>}
                        <span className='text-font-tertiary'>(optional)</span>
                    </Group>
                }
                description='Provide a short description or instructions for your form. This will appear below the title.'
                placeholder='Describe your form...'
                size='md'
            />
        </>
    );
});
