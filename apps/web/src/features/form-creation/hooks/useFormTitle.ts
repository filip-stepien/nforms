import { ChangeEventHandler, FocusEventHandler, useCallback } from 'react';
import { setTitle, titleInitialState } from '../state/formTitleSlice';
import { useFormDispatch } from './useFormDispatch';
import { useFormSelector } from './useFormSelector';

export function useFormTitle() {
    const dispatch = useFormDispatch();
    const title = useFormSelector(state => state.formTitle.title);

    const onTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        event => {
            dispatch(setTitle(event.target.value));
        },
        [dispatch]
    );

    const onTitleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
        event => {
            if (!event.target.value.trim()) {
                dispatch(setTitle(titleInitialState.title));
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
