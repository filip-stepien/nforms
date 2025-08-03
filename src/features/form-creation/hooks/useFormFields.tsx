import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { useListState } from '@mantine/hooks';
import { v4 as uuid } from 'uuid';
import { keysEqual, printKeysOrType } from '../lib/utils';
import { useState } from 'react';

export enum FieldType {
    TEXT = 'Text',
    RATING = 'Rating'
}

export type SettingsMap = {
    [FieldType.TEXT]: TextSettings;
    [FieldType.RATING]: BaseSettings;
};

export type ControlsMap = {
    [FieldType.TEXT]: null;
    [FieldType.RATING]: OptionsControl;
};

export type BaseSettings = {
    required: boolean;
};

export type TextSettings = BaseSettings & {
    analyseSentiment: boolean;
    extractKeywords: boolean;
    summarize: true;
};

export type OptionsControl = {
    options: FieldOption[];
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
        controls: null
    },
    [FieldType.RATING]: {
        settings: {
            required: true
        },
        controls: {
            options: []
        }
    }
};

export function useFormFields(initialFields: Field[] = []) {
    const [lastAddedId, setLastAddedId] = useState<string>();
    const [fields, fieldsHandlers] = useListState<Field>(initialFields);

    const addField = () => {
        const { settings, controls } = initialFieldStates[FieldType.TEXT];
        const id = uuid();

        fieldsHandlers.append({
            id,
            title: 'Untitled question',
            type: FieldType.TEXT,
            settings,
            controls
        });

        setLastAddedId(id);
    };

    const deleteField = (id: string) => {
        fieldsHandlers.filter(f => f.id !== id);
    };

    const reorderField = (from: number, to?: number) => {
        fieldsHandlers.reorder({ from, to: to ?? from });
    };

    const setField = (id: string, updatedField: Partial<Field>) => {
        fieldsHandlers.applyWhere(
            field => field.id === id,
            field => {
                const typeChanged = updatedField.type && updatedField.type !== field.type;
                const newField = {
                    ...field,
                    ...updatedField,
                    settings: typeChanged
                        ? initialFieldStates[updatedField.type!].settings
                        : (updatedField.settings ?? field.settings),
                    controls: typeChanged
                        ? initialFieldStates[updatedField.type!].controls
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
            }
        );
    };

    const getFormFieldProps = (field: Field, index: number) => {
        const { id, title, type, settings, controls } = field;
        const selected = lastAddedId === id;

        return {
            index,
            id,
            title,
            type,
            selected,
            settings,
            controls,
            onSelect: () => setLastAddedId(undefined),
            onTitleChange: (title: string) => setField(id, { title }),
            onFieldTypeChange: (type: FieldType) => setField(id, { type }),
            onDelete: () => deleteField(id),
            onControlsChange: (controls: ControlsMap[FieldType]) => setField(id, { controls }),
            onSettingsChange: (settings: SettingsMap[FieldType]) => setField(id, { settings })
        };
    };

    return { fields, addField, deleteField, setField, reorderField, getFormFieldProps };
}
