import { useCallback, useRef } from 'react';
import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { v4 as uuid } from 'uuid';
import { FieldUpdater } from '../lib/types';

export function useOptionCreator(options: FieldOption[] = [], fieldUpdater: FieldUpdater) {
    const lastAddedIdRef = useRef<string>(null);

    const handleOptionsChange = useCallback(
        (options: FieldOption[]) => {
            fieldUpdater(prev => ({ ...prev, controls: { ...prev.controls, options } }));
        },
        [fieldUpdater]
    );

    const onOptionAdd = useCallback(() => {
        const id = uuid();
        lastAddedIdRef.current = id;
        handleOptionsChange([...options, { id, content: `Option ${options.length + 1}` }]);
    }, [options, handleOptionsChange]);

    const onOptionUpdate = useCallback(
        (id: string, content: string) => {
            handleOptionsChange(options.map(opt => (opt.id === id ? { ...opt, content } : opt)));
        },
        [options, handleOptionsChange]
    );

    const onOptionReorder = useCallback(
        (from: number, to?: number) => {
            const dest = to ?? from;

            if (from === dest) {
                return;
            }

            const updated = [...options];
            const [moved] = updated.splice(from, 1);

            updated.splice(dest, 0, moved);

            handleOptionsChange(updated);
        },
        [options, handleOptionsChange]
    );

    const onOptionDelete = useCallback(
        (id: string) => {
            handleOptionsChange(options.filter(opt => opt.id !== id));
        },
        [options, handleOptionsChange]
    );

    const onOptionSelect = useCallback(() => {
        lastAddedIdRef.current = null;
    }, []);

    return {
        lastAddedId: lastAddedIdRef.current,
        options,
        onOptionAdd,
        onOptionUpdate,
        onOptionReorder,
        onOptionDelete,
        onOptionSelect
    };
}
