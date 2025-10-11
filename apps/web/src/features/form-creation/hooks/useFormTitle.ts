import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ChangeEventHandler, FocusEventHandler, useCallback } from 'react';
import { setTitle, initialTitle } from '../state/slices/title';

export function useFormTitle() {
    const dispatch = useAppDispatch();
    const title = useAppSelector(state => state.formTitle.title);

    const onTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            dispatch(setTitle(event.target.value));
        },
        [dispatch]
    );

    const onTitleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
        event => {
            if (!event.target.value.trim()) {
                dispatch(setTitle(initialTitle));
            }
        },
        [dispatch]
    );

    return {
        title,
        onTitleChange,
        onTitleBlur
    };
}
