import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { keysEqual, printKeysOrType } from '../lib/utils';
import { Field, FieldType } from '../lib/types';
import { initialFieldStates } from '../lib/constants';

export type FormFieldsState = {
    fields: Field[];
    addField: () => void;
    deleteField: (id: string) => void;
    reorderField: (from: number, to?: number) => void;
    setField: (id: string, updatedField: Partial<Field>) => void;
    setLastAddedId: (id: string | null) => void;
    getLastAddedId: () => string | null;
};

let lastAddedId: string | null = null;

export const useFormFieldsStore = create<FormFieldsState>(set => ({
    fields: [],

    setLastAddedId: (id: string | null) => {
        lastAddedId = id;
    },

    getLastAddedId: () => lastAddedId,

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
            ]
        }));

        lastAddedId = id;
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
                };

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
    }
}));
