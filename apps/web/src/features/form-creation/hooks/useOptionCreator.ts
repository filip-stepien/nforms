import { useCallback, useRef } from 'react';
import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { v4 as uuid } from 'uuid';
import { ControlsMap, Field, FieldType, FieldUpdater, RuleGroup } from '../lib/types';
import { findRules, updateGroup, updateRule } from '../lib/rules';

export function useOptionCreator(
    options: FieldOption[] = [],
    fieldUpdater: FieldUpdater,
    field: Field
) {
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

        if (field.type === FieldType.SELECTION) {
            const updateRules = (root: RuleGroup) => {
                const rules = findRules(field.controls.rules, r => !r.value);
                let newRoot: RuleGroup = root;

                for (const rule of rules) {
                    newRoot = updateRule(root, rule.id, r => ({ ...r, value: id }));
                }

                return newRoot;
            };

            fieldUpdater(prev => ({
                ...prev,
                controls: {
                    ...prev.controls,
                    rules: updateRules(prev.controls.rules),
                    options: [...options, { id, content: `Option ${options.length + 1}` }]
                }
            }));
        } else {
            handleOptionsChange([...options, { id, content: `Option ${options.length + 1}` }]);
        }
    }, [field.controls.rules, field.type, fieldUpdater, options, handleOptionsChange]);

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
            if (field.type === FieldType.SELECTION) {
                const updateRules = (root: RuleGroup) => {
                    const rules = findRules(field.controls.rules, r => r.value === id);
                    let newRoot: RuleGroup = root;

                    for (const rule of rules) {
                        newRoot = updateRule(root, rule.id, r => ({ ...r, value: undefined }));
                    }

                    return newRoot;
                };

                fieldUpdater(prev => ({
                    ...prev,
                    controls: {
                        ...prev.controls,
                        rules: updateRules(prev.controls.rules),
                        options: options.filter(opt => opt.id !== id)
                    }
                }));
            } else {
                handleOptionsChange(options.filter(opt => opt.id !== id));
            }
        },
        [options, handleOptionsChange, fieldUpdater, field]
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
