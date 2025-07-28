import { useImperativeHandle, useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

export type OptionCreatorRef = {
    getOptions: () => string[];
};

type FieldOption = {
    id: string;
    content: string;
};

export function useOptionCreator(ref?: React.Ref<OptionCreatorRef>) {
    const [options, setOptions] = useState<FieldOption[]>([]);

    useImperativeHandle(
        ref,
        () => ({
            getOptions: () => options.map(opt => opt.content)
        }),
        [options]
    );

    const addOption = useCallback(() => {
        setOptions(prev => [...prev, { id: uuid(), content: '' }]);
    }, []);

    const updateOption = useCallback((id: string, content: string) => {
        setOptions(prev => prev.map(opt => (opt.id === id ? { ...opt, content } : opt)));
    }, []);

    const deleteOption = useCallback((id: string) => {
        setOptions(prev => prev.filter(opt => opt.id !== id));
    }, []);

    return {
        options,
        addOption,
        updateOption,
        deleteOption
    };
}
