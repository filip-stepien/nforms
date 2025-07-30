import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { ControlsMap, FieldType } from '../hooks/useFormFields';
import { v4 as uuid } from 'uuid';

export function getOptionCreatorProps(
    options: FieldOption[],
    controlsChangeFn: (controls: ControlsMap[FieldType]) => void
) {
    return {
        options,
        onOptionAdd: () => {
            controlsChangeFn?.({ options: [...options, { id: uuid(), content: '' }] });
        },
        onOptionUpdate: (id: string, content: string) => {
            controlsChangeFn?.({
                options: options.map(opt => (opt.id === id ? { ...opt, content } : opt))
            });
        },
        onOptionReorder: (from: number, to: number) => {
            const updated = [...options];
            const [moved] = updated.splice(from, 1);
            updated.splice(to, 0, moved);
            controlsChangeFn?.({ options: updated });
        },
        onOptionDelete: (id: string) => {
            controlsChangeFn?.({ options: options.filter(opt => opt.id !== id) });
        }
    };
}
