import { AppDispatch } from '@/lib/store';
import { FieldPatch, _addField, _deleteField, _setField } from './slices/fields';
import { addSettings, deleteSettings } from './slices/settings';
import { v4 as uuid } from 'uuid';
import { _deleteOption, deleteOptionsByField } from './slices/options';
import { Field } from '@packages/db/schemas/form';
import {
    addGroup,
    deleteRulesAndGroups,
    deleteRulesByFieldId,
    deleteRulesByValue
} from './slices/rules';

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
        dispatch(_deleteField({ fieldId }));
        dispatch(deleteSettings({ fieldId }));
        dispatch(deleteRulesAndGroups({ fieldId }));
        dispatch(deleteOptionsByField({ fieldId }));
        dispatch(deleteRulesByFieldId({ fieldId }));
    };

export const setField =
    (payload: { fieldId: string; field: FieldPatch }) => (dispatch: AppDispatch) => {
        const { fieldId, field: fieldPatch } = payload;

        const newType = fieldPatch.type;
        const typeChanged = newType && newType !== fieldId;

        if (typeChanged) {
            dispatch(addSettings({ fieldId, fieldType: newType }));
            dispatch(deleteOptionsByField({ fieldId }));
            dispatch(deleteRulesAndGroups({ fieldId }));
            dispatch(deleteRulesByFieldId({ fieldId }));
            dispatch(
                addGroup({
                    group: {
                        id: uuid(),
                        fieldId,
                        type: 'group',
                        combinator: 'OR',
                        childrenGroups: [],
                        childrenRules: []
                    }
                })
            );
        }

        dispatch(_setField(payload));
    };

export const deleteOption =
    ({ optionId }: { optionId: string }) =>
    (dispatch: AppDispatch) => {
        dispatch(_deleteOption({ optionId }));
        dispatch(deleteRulesByValue({ value: optionId }));
    };
