import { useState } from 'react';
import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { ControlsMap, FieldType } from './useFormFields';
import { v4 as uuid } from 'uuid';

export function useOptionCreator(
    options: FieldOption[] = [],
    controlsChangeFn: (controls: ControlsMap[FieldType]) => void
) {
    const [lastAddedId, setLastAddedId] = useState<string>();

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

    const onOptionReorder = (from: number, to: number) => {
        const updated = [...options];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        controlsChangeFn({ options: updated });
    };

    const onOptionDelete = (id: string) => {
        controlsChangeFn({ options: options.filter(opt => opt.id !== id) });
    };

    return {
        lastAddedId,
        options,
        onOptionAdd,
        onOptionUpdate,
        onOptionReorder,
        onOptionDelete
    };
}
