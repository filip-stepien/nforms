import { setFormTitle, setFormDescription } from '@/features/form-creation/state/form';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Stack, TextInput, Textarea } from '@mantine/core';
import { ChangeEventHandler } from 'react';

export function FormHeader() {
    const form = useAppSelector(state => state.form);
    const dispatch = useAppDispatch();

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        dispatch(setFormTitle(event.target.value));
    };

    const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
        dispatch(setFormDescription(event.target.value));
    };

    return (
        <Stack gap='sm' className='h-fit'>
            <TextInput
                label='Title'
                value={form.title}
                onChange={handleTitleChange}
                variant='unstyled'
                classNames={{ input: 'text-3xl' }}
            />
            <Textarea
                label='Description'
                placeholder={form.description ? undefined : 'No description provided.'}
                value={form.description ?? ''}
                onChange={handleDescriptionChange}
                variant='unstyled'
                classNames={{ input: 'text-md text-justify' }}
                rows={1}
                autosize
            />
        </Stack>
    );
}
