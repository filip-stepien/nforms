import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum FieldType {
    TEXT = 'Text',
    SELECTION = 'Selection'
}

export type Field = {
    id: string;
    type: FieldType;
    title: string;
};

export type FieldPatch = Partial<Omit<Field, 'id'>>;

export type FormFieldsState = Field[];

const initialState: FormFieldsState = [];

const formFieldsSlice = createSlice({
    name: 'formFields',
    initialState,
    reducers: {
        _addField: (state, action: PayloadAction<Field>) => {
            state.push(action.payload);
        },
        _deleteField: (state, action: PayloadAction<{ fieldId: string }>) => {
            const index = state.findIndex(f => f.id === action.payload.fieldId);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        _setField: (state, action: PayloadAction<{ fieldId: string; field: FieldPatch }>) => {
            const { fieldId, field: fieldPatch } = action.payload;
            const field = state.find(f => f.id === fieldId);

            if (field) {
                Object.assign(field, fieldPatch);
            }
        },
        reorderField: (state, action: PayloadAction<{ from: number; to?: number }>) => {
            const { from, to } = action.payload;
            const [moved] = state.splice(from, 1);
            state.splice(to ?? from, 0, moved);
        }
    }
});

export const formFieldsReducer = formFieldsSlice.reducer;

export const { _addField, _deleteField, _setField, reorderField } = formFieldsSlice.actions;
