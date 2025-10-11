import { AppDispatch, RootState } from '@/lib/store';
import { Field, FieldPatch, FieldType, _addField, _deleteField, _setField } from './slices/fields';
import { addSettings, deleteSettings, initializeSettings } from './slices/settings';
import { addGroup } from './slices/rules';
import { v4 as uuid } from 'uuid';
import { deleteOptions, initializeOptions } from './slices/options';

type FieldSpecificDispatchers = Record<
    FieldType,
    {
        onTypeChange?: (dispatch: AppDispatch, fieldId: string) => any;
        onDelete?: (dispatch: AppDispatch, fieldId: string) => any;
    }
>;

const fieldSpecificDispatchers: FieldSpecificDispatchers = {
    [FieldType.SELECTION]: {
        onTypeChange: (dispatch, fieldId) => {
            dispatch(initializeOptions({ fieldId }));
        },
        onDelete: (dispatch, fieldId) => {
            dispatch(deleteOptions({ fieldId }));
        }
    },
    [FieldType.TEXT]: {}
};

export const addField = (field: Field) => (dispatch: AppDispatch) => {
    dispatch(_addField(field));
    dispatch(addSettings({ fieldId: field.id, fieldType: field.type }));
    dispatch(
        addGroup({
            fieldId: field.id,
            group: {
                id: uuid(),
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
    (dispatch: AppDispatch, getState: () => RootState) => {
        const field = getState().formFields.find(f => f.id === fieldId);
        if (!field) return;

        dispatch(deleteSettings({ fieldId }));
        dispatch(_deleteField({ fieldId }));

        fieldSpecificDispatchers[field.type].onDelete?.(dispatch, fieldId);
    };

export const setField =
    (payload: { fieldId: string; field: FieldPatch }) =>
    (dispatch: AppDispatch, getState: () => RootState) => {
        const { fieldId, field: fieldPatch } = payload;

        const field = getState().formFields.find(f => f.id === fieldId);
        if (!field) return;

        dispatch(_setField(payload));

        const newType = fieldPatch.type;
        const typeChanged = newType && newType !== field.id;
        if (!typeChanged) return;

        dispatch(initializeSettings({ fieldId, fieldType: newType }));
        fieldSpecificDispatchers[newType].onTypeChange?.(dispatch, fieldId);
    };
