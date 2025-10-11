import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { selectFieldOptions } from '../state/selectors';
import { reorderField } from '../state/slices/fields';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addOption, deleteOption, setOption } from '../state/slices/options';

export function useOptionItem(fieldId: string, optionId: string) {
    const inputRef = useRef<HTMLInputElement>(null);
    const lastAddedIdRef = useRef<string>(null);
    const options = useAppSelector(state => selectFieldOptions(state, fieldId));
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (lastAddedIdRef.current === optionId) {
            inputRef.current?.select();
            lastAddedIdRef.current = null;
        }
    }, [optionId]);

    const onOptionAdd = useCallback(() => {
        const id = uuid();
        lastAddedIdRef.current = id;

        dispatch(
            addOption({
                fieldId,
                option: { id, content: `Option ${options.length + 1}` }
                // rules: updateRules(
                //     rules,
                //     r => !r.value,
                //     r => ({ ...r, value: id })
                // ),
            })
        );
    }, [fieldId, dispatch, options.length]);

    const onOptionUpdate = useCallback(
        (optionId: string, content: string) => {
            dispatch(setOption({ fieldId, optionId, option: { content } }));
        },
        [fieldId, dispatch]
    );

    const onOptionReorder = useCallback(
        (from: number, to?: number) => {
            dispatch(reorderField({ from, to }));
        },
        [dispatch]
    );

    const onOptionDelete = useCallback(
        (optionId: string) => {
            dispatch(deleteOption({ fieldId, optionId }));
            // rules: updateRules(
            //     rules,
            //     r => r.value === id,
            //     r => ({ ...r, value: undefined })
            // ),
        },
        [fieldId, dispatch]
    );

    return {
        inputRef,
        selected: lastAddedIdRef.current === optionId,
        onOptionAdd,
        onOptionUpdate,
        onOptionReorder,
        onOptionDelete
    };
}
