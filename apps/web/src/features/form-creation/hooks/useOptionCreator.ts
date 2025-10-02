import { useState } from 'react';
import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { OptionsControl } from './useFormFields';
import { v4 as uuid } from 'uuid';

export function useOptionCreator(
    options: FieldOption[] = [],
    controlsChangeFn: (controls: OptionsControl) => void
) {
    const [lastAddedId, setLastAddedId] = useState<string | undefined>();

    const onOptionAdd = () => {
        const id = uuid();
        setLastAddedId(id);
        controlsChangeFn({
            options: [...options, { id, content: `Option ${options.length + 1}` }]
        });
    };

    const onOptionUpdate = (id: string, content: string) => {
        controlsChangeFn({
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

        controlsChangeFn({ options: updated });
    };

    const onOptionDelete = (id: string) => {
        controlsChangeFn({ options: options.filter(opt => opt.id !== id) });
    };

    const onOptionSelect = () => {
        setLastAddedId(undefined);
    };

    return {
        lastAddedId,
        options,
        onOptionAdd,
        onOptionUpdate,
        onOptionReorder,
        onOptionDelete,
        onOptionSelect
    };
}
