import { useListState } from '@mantine/hooks';
import { useImperativeHandle, useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

export type OptionCreatorRef = {
    getOptions: () => string[];
};

export type FieldOption = {
    id: string;
    content: string;
};

export function useOptionCreator(ref?: React.Ref<OptionCreatorRef>) {
    const [options, handlers] = useListState<FieldOption>([
        {
            id: uuid(),
            content: ''
        }
    ]);

    useImperativeHandle(
        ref,
        () => ({
            getOptions: () => options.map(opt => opt.content)
        }),
        [options]
    );

    const addOption = useCallback(() => {
        handlers.append({ id: uuid(), content: '' });
    }, []);

    const updateOption = useCallback((id: string, content: string) => {
        handlers.applyWhere(
            opt => opt.id === id,
            opt => ({ ...opt, content })
        );
    }, []);

    const deleteOption = useCallback((id: string) => {
        handlers.filter(opt => opt.id !== id);
    }, []);

    const reorderOption = useCallback((from: number, to: number) => {
        handlers.reorder({ from, to });
    }, []);

    return {
        options,
        addOption,
        updateOption,
        deleteOption,
        reorderOption
    };
}
