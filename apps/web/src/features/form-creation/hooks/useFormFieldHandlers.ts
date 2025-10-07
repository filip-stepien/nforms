import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { Field, FieldUpdater } from '../lib/types';
import { useFormFieldsStore } from './useFormFieldsStore';

export function useFormFieldHandlers(field: Field) {
    const { setField, deleteField, getLastAddedId, setLastAddedId } = useFormFieldsStore(
        useShallow(state => ({
            setField: state.setField,
            deleteField: state.deleteField,
            getLastAddedId: state.getLastAddedId,
            setLastAddedId: state.setLastAddedId
        }))
    );

    const onSelect = () => {
        if (getLastAddedId() !== null) {
            setLastAddedId(null);
        }
    };

    const onDelete = () => deleteField(field.id);

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
