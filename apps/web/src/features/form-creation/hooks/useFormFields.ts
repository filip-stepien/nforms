import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { v4 as uuid } from 'uuid';
import { keysEqual, printKeysOrType } from '../lib/utils';
import { useCallback, useRef, useState } from 'react';
import { RuleGroup } from '../components/field-controls/rules-creator/RulesCreator';

export enum FieldType {
    TEXT = 'Text',
    SELECTION = 'Selection'
}

export type SettingsMap = {
    [FieldType.TEXT]: TextSettings;
    [FieldType.SELECTION]: SelectionSettings;
};

export type ControlsMap = {
    [FieldType.TEXT]: RulesControl;
    [FieldType.SELECTION]: OptionsControl;
};

export type BaseSettings = {
    required: boolean;
};

export type TextSettings = BaseSettings & {
    analyseSentiment: boolean;
    extractKeywords: boolean;
    summarize: true;
};

export type SelectionSettings = BaseSettings & {
    singleSelection: boolean;
};

export type OptionsControl = {
    options: FieldOption[];
};

export type RulesControl = {
    rules: RuleGroup;
};

export type Field = {
    [K in FieldType]: {
        id: string;
        title: string;
        type: K;
        controls: ControlsMap[K];
        settings: SettingsMap[K];
    };
}[FieldType];

type InitialFieldStates = {
    [K in FieldType]: {
        settings: SettingsMap[K];
        controls: ControlsMap[K];
    };
};

export const initialFieldStates: InitialFieldStates = {
    [FieldType.TEXT]: {
        settings: {
            required: true,
            analyseSentiment: true,
            extractKeywords: true,
            summarize: true
        },
        controls: {
            rules: {
                id: uuid(),
                combinator: 'AND',
                type: 'group',
                rules: []
            }
        }
    },
    [FieldType.SELECTION]: {
        settings: {
            required: true,
            singleSelection: false
        },
        controls: {
            options: []
        }
    }
};

export function useFormFields(initialFields: Field[] = []) {
    const lastAddedIdRef = useRef<string>(null);
    const [fields, setFields] = useState<Field[]>(initialFields);

    const addField = useCallback(() => {
        const { settings, controls } = initialFieldStates[FieldType.TEXT];
        const id = uuid();

        setFields(prev => [
            ...prev,
            {
                id,
                title: 'Untitled question',
                type: FieldType.TEXT,
                settings,
                controls
            }
        ]);

        lastAddedIdRef.current = id;
    }, []);

    const deleteField = useCallback((id: string) => {
        setFields(prev => prev.filter(f => f.id !== id));
    }, []);

    const reorderField = useCallback((from: number, to?: number) => {
        setFields(prev => {
            const copy = [...prev];
            const [moved] = copy.splice(from, 1);
            copy.splice(to ?? from, 0, moved);
            return copy;
        });
    }, []);

    const setField = useCallback((id: string, updatedField: Partial<Field>) => {
        setFields(prev =>
            prev.map(field => {
                if (field.id !== id) return field;

                const updatedFieldType = updatedField.type;
                const typeChanged = updatedFieldType && updatedFieldType !== field.type;

                const newField = {
                    ...field,
                    ...updatedField,
                    settings: typeChanged
                        ? initialFieldStates[updatedFieldType].settings
                        : (updatedField.settings ?? field.settings),
                    controls: typeChanged
                        ? initialFieldStates[updatedFieldType].controls
                        : (updatedField.controls ?? field.controls)
                } as Field;

                const initial = initialFieldStates[newField.type];

                if (!keysEqual(initial.settings, newField.settings)) {
                    console.warn(
                        `Field settings mismatch for field "${newField.type}" (id: ${newField.id}).\n\n` +
                            `- Received: ${printKeysOrType(newField.settings)}\n\n` +
                            `- Expected: ${printKeysOrType(initial.settings)}\n\n` +
                            'Field types are resolved at runtime - ' +
                            'updating settings without validation may cause runtime errors.'
                    );
                    return field;
                }

                if (!keysEqual(initial.controls, newField.controls)) {
                    console.warn(
                        `Field controls mismatch for field "${newField.type}" (id: ${newField.id}).\n\n` +
                            `- Received: ${printKeysOrType(newField.controls)}\n\n` +
                            `- Expected: ${printKeysOrType(initial.controls)}\n\n` +
                            'Field types are resolved at runtime - ' +
                            'updating controls without validation may cause runtime errors.'
                    );
                    return field;
                }

                return newField;
            })
        );
    }, []);

    return {
        fields,
        lastAddedIdRef,
        addField,
        deleteField,
        setField,
        reorderField
    };
}
