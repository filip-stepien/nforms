import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { keysEqual, printKeysOrType } from '../lib/utils';
import { FieldOption } from '../components/field-controls/option-creator/OptionCreator';
import { RuleGroup } from '../components/field-controls/rules-creator/RulesCreator';
import { useShallow } from 'zustand/shallow';

// --- Typy z Twojego kodu ---

export enum FieldType {
    TEXT = 'Text',
    SELECTION = 'Selection'
}

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

export type OptionsControl = { options: FieldOption[] };
export type RulesControl = { rules: RuleGroup };

export type SettingsMap = {
    [FieldType.TEXT]: TextSettings;
    [FieldType.SELECTION]: SelectionSettings;
};

export type ControlsMap = {
    [FieldType.TEXT]: RulesControl;
    [FieldType.SELECTION]: OptionsControl;
};

export type Field = {
    [K in FieldType]: {
        id: string;
        title: string;
        type: K;
        settings: SettingsMap[K];
        controls: ControlsMap[K];
    };
}[FieldType];

type InitialFieldStates = {
    [K in FieldType]: {
        settings: SettingsMap[K];
        controls: ControlsMap[K];
    };
};

// --- Stałe i wartości początkowe ---

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

// --- Zustand Store ---

export interface FormFieldsState {
    fields: Field[];
    lastAddedId: string | null;
    addField: () => void;
    deleteField: (id: string) => void;
    reorderField: (from: number, to?: number) => void;
    setField: (id: string, updatedField: Partial<Field>) => void;
    reset: () => void;
}

export const useFormFieldsStore = create<FormFieldsState>((set, get) => ({
    fields: [],
    lastAddedId: null,

    addField: () => {
        const { settings, controls } = initialFieldStates[FieldType.TEXT];
        const id = uuid();

        set(state => ({
            fields: [
                ...state.fields,
                {
                    id,
                    title: 'Untitled question ' + state.fields.length,
                    type: FieldType.TEXT,
                    settings,
                    controls
                }
            ],
            lastAddedId: id
        }));
    },

    deleteField: id => {
        set(state => ({
            fields: state.fields.filter(f => f.id !== id)
        }));
    },

    reorderField: (from, to) => {
        set(state => {
            const copy = [...state.fields];
            const [moved] = copy.splice(from, 1);
            copy.splice(to ?? from, 0, moved);
            return { fields: copy };
        });
    },

    setField: (id, updatedField) => {
        set(state => ({
            fields: state.fields.map(field => {
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
                            `- Expected: ${printKeysOrType(initial.settings)}`
                    );
                    return field;
                }

                if (!keysEqual(initial.controls, newField.controls)) {
                    console.warn(
                        `Field controls mismatch for field "${newField.type}" (id: ${newField.id}).\n\n` +
                            `- Received: ${printKeysOrType(newField.controls)}\n\n` +
                            `- Expected: ${printKeysOrType(initial.controls)}`
                    );
                    return field;
                }

                return newField;
            })
        }));
    },

    reset: () => set({ fields: [], lastAddedId: null })
}));

export const useShallowFormFieldsStore = (selector: (state: FormFieldsState) => void) =>
    useFormFieldsStore(useShallow(selector));
