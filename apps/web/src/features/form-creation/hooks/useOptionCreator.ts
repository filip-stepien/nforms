import { useCallback, useRef } from 'react';
import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { v4 as uuid } from 'uuid';
import { FieldType } from '../lib/types';
import { updateRules } from '../lib/rules';
import { useFormDispatch } from './useFormDispatch';
import { useFormSelector } from './useFormSelector';
import { selectFieldById, setField } from '../state/formFieldsSlice';

export function useOptionCreator(fieldId: string) {
    const lastAddedIdRef = useRef<string>(null);
    const dispatch = useFormDispatch();
    const { options, rules } = useFormSelector(
        state => selectFieldById<FieldType.SELECTION>(state, fieldId).controls
    );

    const dispatchOptions = useCallback(
        (updatedOptions: FieldOption[]) => {
            dispatch(
                setField<FieldType.SELECTION>({
                    fieldId,
                    field: { controls: { options: updatedOptions } }
                })
            );
        },
        [fieldId, dispatch]
    );

    const onOptionAdd = useCallback(() => {
        const id = uuid();
        lastAddedIdRef.current = id;

        dispatch(
            setField<FieldType.SELECTION>({
                fieldId,
                field: {
                    controls: {
                        rules: updateRules(
                            rules,
                            r => !r.value,
                            r => ({ ...r, value: id })
                        ),
                        options: [...options, { id, content: `Option ${options.length + 1}` }]
                    }
                }
            })
        );
    }, [fieldId, dispatch, rules, options]);

    const onOptionUpdate = useCallback(
        (id: string, content: string) => {
            dispatchOptions(options.map(opt => (opt.id === id ? { ...opt, content } : opt)));
        },
        [dispatchOptions, options]
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

            dispatchOptions(updated);
        },
        [dispatchOptions, options]
    );

    const onOptionDelete = useCallback(
        (id: string) => {
            dispatch(
                setField<FieldType.SELECTION>({
                    fieldId,
                    field: {
                        controls: {
                            rules: updateRules(
                                rules,
                                r => r.value === id,
                                r => ({ ...r, value: undefined })
                            ),
                            options: options.filter(opt => opt.id !== id)
                        }
                    }
                })
            );
        },
        [fieldId, dispatch, rules, options]
    );

    const onOptionSelect = useCallback(() => {
        lastAddedIdRef.current = null;
    }, []);

    return {
        lastAddedId: lastAddedIdRef.current,
        onOptionAdd,
        onOptionUpdate,
        onOptionReorder,
        onOptionDelete,
        onOptionSelect
    };
}
