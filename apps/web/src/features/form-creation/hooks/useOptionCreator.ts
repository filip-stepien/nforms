import { useCallback, useRef } from 'react';
import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { v4 as uuid } from 'uuid';

export function useOptionCreator(
    options: FieldOption[] = [],
    onOptionsChange: (options: FieldOption[]) => void
) {
    const lastAddedIdRef = useRef<string>(null);

    const onOptionAdd = () => {
        const id = uuid();

        lastAddedIdRef.current = id;

        onOptionsChange([...options, { id, content: `Option ${options.length + 1}` }]);
    };

    const onOptionUpdate = (id: string, content: string) => {
        onOptionsChange(options.map(opt => (opt.id === id ? { ...opt, content } : opt)));
    };

    const onOptionReorder = (from: number, to?: number) => {
        const dest = to ?? from;

        if (from === dest) {
            return;
        }

        const updated = [...options];
        const [moved] = updated.splice(from, 1);

        updated.splice(dest, 0, moved);

        onOptionsChange(updated);
    };

    const onOptionDelete = (id: string) => {
        onOptionsChange(options.filter(opt => opt.id !== id));
    };

    const onOptionSelect = () => {
        lastAddedIdRef.current = null;
    };

    return {
        lastAddedId: lastAddedIdRef.current,
        options,
        onOptionAdd: useCallback(onOptionAdd, [options, onOptionsChange]),
        onOptionUpdate: useCallback(onOptionUpdate, [options, onOptionsChange]),
        onOptionReorder: useCallback(onOptionReorder, [options, onOptionsChange]),
        onOptionDelete: useCallback(onOptionDelete, [options, onOptionsChange]),
        onOptionSelect: useCallback(onOptionSelect, [])
    };
}
