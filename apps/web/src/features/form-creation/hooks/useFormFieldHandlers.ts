import { useCallback } from 'react';
import { Field, FieldUpdater } from '../lib/types';
import { useDispatch } from 'react-redux';
import { deleteField } from '../state/formFieldsSlice';

export function useFormFieldHandlers(field: Field) {
    const dispatch = useDispatch();

    const onSelect = () => {
        // if (getLastAddedId() !== null) {
        //     setLastAddedId(null);
        // }
    };

    const onDelete = () => {
        dispatch(deleteField(field.id));
    };

    const onChange: FieldUpdater = state => {
        const newField = typeof state === 'function' ? state(field) : state;
        setField(field.id, newField);
    };

    return {
        isSelected: getLastAddedId() === field.id,
        onSelect: useCallback(onSelect, [getLastAddedId, setLastAddedId]),
        onDelete: useCallback(onDelete, [field.id, deleteField]),
        onChange: useCallback(onChange, [field, setField])
    };
}
