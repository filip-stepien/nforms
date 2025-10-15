import { RootState } from '@/lib/store';
import { Field } from '@packages/db/schemas/form';
import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';

export type FieldPatch = Partial<Omit<Field, 'id'>>;

const fieldsAdapter = createEntityAdapter<Field>();

const initialState = fieldsAdapter.getInitialState();

const formFieldsSlice = createSlice({
    name: 'formFields',
    initialState,
    reducers: {
        _addField: fieldsAdapter.addOne,
        _deleteField: (state, action: PayloadAction<{ fieldId: string }>) => {
            fieldsAdapter.removeOne(state, action.payload.fieldId);
        },
        _setField: (state, action: PayloadAction<{ fieldId: string; field: FieldPatch }>) => {
            const { fieldId, field } = action.payload;
            fieldsAdapter.updateOne(state, {
                id: fieldId,
                changes: field
            });
        },
        reorderField: (state, action: PayloadAction<{ from: number; to?: number }>) => {
            const allIds = [...state.ids];
            const { from, to } = action.payload;
            const [moved] = allIds.splice(from, 1);
            allIds.splice(to ?? from, 0, moved);
            state.ids = allIds;
        }
    }
});

export const formFieldsReducer = formFieldsSlice.reducer;
export const { _addField, _deleteField, _setField, reorderField } = formFieldsSlice.actions;

export const { selectAll: selectFields, selectById: selectFieldById } =
    fieldsAdapter.getSelectors<RootState>(state => state.formFields);
