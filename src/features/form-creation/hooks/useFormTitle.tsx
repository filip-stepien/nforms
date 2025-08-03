import { ChangeEventHandler, FocusEventHandler, useState } from 'react';

export function useFormTitle(initialTitle?: string) {
    const defaultTitle = 'Untitled form';
    const [title, setTitle] = useState(initialTitle ?? defaultTitle);

    const onTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        setTitle(event.target.value);
    };

    const onTitleBlur: FocusEventHandler<HTMLInputElement> = event => {
        if (!event.target.value.trim()) {
            setTitle(defaultTitle);
        }
    };

    return { title, onTitleChange, onTitleBlur };
}
