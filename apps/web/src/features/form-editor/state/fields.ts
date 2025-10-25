import { AppDispatch, RootState } from '@/lib/store';
import { Field } from '@packages/db/schemas/form/form-fields';
import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { deleteRulesState } from './field-rules';
import { addSettings, deleteSettings } from './field-settings';
import { deleteOptionsByField } from './field-options';

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

export const addField = (field: Field) => (dispatch: AppDispatch) => {
    dispatch(_addField(field));
    dispatch(addSettings({ fieldId: field.id, fieldType: field.type }));
};

export const deleteField =
    ({ fieldId }: { fieldId: string }) =>
    (dispatch: AppDispatch) => {
        dispatch(_deleteField({ fieldId }));
        dispatch(deleteSettings({ fieldId }));
        dispatch(deleteRulesState({ fieldId }));
        dispatch(deleteOptionsByField({ fieldId }));
    };

export const setField =
    (payload: { fieldId: string; field: FieldPatch }) => (dispatch: AppDispatch) => {
        const { fieldId, field: fieldPatch } = payload;

        const newType = fieldPatch.type;
        const typeChanged = newType && newType !== fieldId;

        if (typeChanged) {
            dispatch(addSettings({ fieldId, fieldType: newType }));
            dispatch(deleteOptionsByField({ fieldId }));
            dispatch(deleteRulesState({ fieldId }));
        }

        dispatch(_setField(payload));
    };

export const formFieldsReducer = formFieldsSlice.reducer;
export const { _addField, _deleteField, _setField, reorderField } = formFieldsSlice.actions;

export const { selectAll: selectFields, selectById: selectFieldById } =
    fieldsAdapter.getSelectors<RootState>(state => state.formFields);
