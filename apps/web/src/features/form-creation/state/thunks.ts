import { AppDispatch } from '@/lib/store';
import { Field, FieldPatch, _addField, _deleteField, _setField } from './slices/fields';
import { addSettings, deleteSettings, initializeSettings } from './slices/settings';
import { addGroup, deleteRulesAndGroups } from './slices/rules';
import { v4 as uuid } from 'uuid';
import { deleteOptionsByField } from './slices/options';

export const addField = (field: Field) => (dispatch: AppDispatch) => {
    dispatch(_addField(field));
    dispatch(addSettings({ fieldId: field.id, fieldType: field.type }));
    dispatch(
        addGroup({
            group: {
                id: uuid(),
                fieldId: field.id,
                type: 'group',
                combinator: 'OR',
                childrenGroups: [],
                childrenRules: []
            }
        })
    );
};

export const deleteField =
    ({ fieldId }: { fieldId: string }) =>
    (dispatch: AppDispatch) => {
        dispatch(deleteSettings({ fieldId }));
        dispatch(_deleteField({ fieldId }));
        dispatch(deleteRulesAndGroups({ fieldId }));
        deleteOptionsByField({ fieldId });
    };

export const setField =
    (payload: { fieldId: string; field: FieldPatch }) => (dispatch: AppDispatch) => {
        const { fieldId, field: fieldPatch } = payload;

        const newType = fieldPatch.type;
        const typeChanged = newType && newType !== fieldId;

        if (typeChanged) {
            dispatch(initializeSettings({ fieldId, fieldType: newType }));
            dispatch(deleteOptionsByField({ fieldId }));
        }

        dispatch(_setField(payload));
    };
