import { useCallback, useRef } from 'react';
import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { v4 as uuid } from 'uuid';
import { OptionsControl } from '../lib/types';

export function useOptionCreator(
    options: FieldOption[] = [],
    onControlsChange: (controls: OptionsControl) => void
) {
    const lastAddedIdRef = useRef<string>(null);

    const onOptionAdd = () => {
        const id = uuid();

        lastAddedIdRef.current = id;

        onControlsChange({
            options: [...options, { id, content: `Option ${options.length + 1}` }]
        });
    };

    const onOptionUpdate = (id: string, content: string) => {
        onControlsChange({
            options: options.map(opt => (opt.id === id ? { ...opt, content } : opt))
        });
    };

    const onOptionReorder = (from: number, to?: number) => {
        const dest = to ?? from;

        if (from === dest) {
            return;
        }

        const updated = [...options];
        const [moved] = updated.splice(from, 1);

        updated.splice(dest, 0, moved);

        onControlsChange({ options: updated });
    };

    const onOptionDelete = (id: string) => {
        onControlsChange({ options: options.filter(opt => opt.id !== id) });
    };

    const onOptionSelect = () => {
        lastAddedIdRef.current = null;
    };

    return {
        lastAddedId: lastAddedIdRef.current,
        options,
        onOptionAdd: useCallback(onOptionAdd, [options, onControlsChange]),
        onOptionUpdate: useCallback(onOptionUpdate, [options, onControlsChange]),
        onOptionReorder: useCallback(onOptionReorder, [options, onControlsChange]),
        onOptionDelete: useCallback(onOptionDelete, [options, onControlsChange]),
        onOptionSelect: useCallback(onOptionSelect, [])
    };
}
