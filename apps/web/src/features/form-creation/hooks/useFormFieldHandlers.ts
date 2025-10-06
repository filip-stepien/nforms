import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { FieldType, ControlsMap, Field, SettingsMap, RuleGroup, FieldOption } from '../lib/types';
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

    const onSelect = useCallback(() => {
        if (getLastAddedId() !== null) {
            setLastAddedId(null);
        }
    }, [getLastAddedId, setLastAddedId]);

    const onTitleChange = useCallback(
        (title: string) => setField(field.id, { title }),
        [field.id, setField]
    );

    const onTypeChange = useCallback(
        (type: FieldType) => setField(field.id, { type }),
        [field.id, setField]
    );

    const onDelete = useCallback(() => deleteField(field.id), [field.id, deleteField]);

    const onControlsChange = useCallback(
        (controls: ControlsMap[FieldType]) => setField(field.id, { controls } as Partial<Field>),
        [field.id, setField]
    );

    const onSettingsChange = useCallback(
        (settings: SettingsMap[FieldType]) => setField(field.id, { settings } as Partial<Field>),
        [field.id, setField]
    );

    const onRulesChange = useCallback(
        (rules: RuleGroup) => onControlsChange({ rules }),
        [onControlsChange]
    );

    const onOptionsChange = useCallback(
        (options: FieldOption[]) => onControlsChange({ options, rules: field.controls.rules }),
        [field.controls.rules, onControlsChange]
    );

    return {
        isSelected: getLastAddedId() === field.id,
        onSelect,
        onTitleChange,
        onTypeChange,
        onDelete,
        onSettingsChange,
        onControlsChange,
        onRulesChange,
        onOptionsChange
    };
}
