import { Flex, Stack } from '@mantine/core';
import { memo, useCallback } from 'react';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import { Draggable } from '@hello-pangea/dnd';
import { FieldHeader } from './FieldHeader';
import { FieldBody } from './FieldBody';
import { SelectionFieldSettings } from '../field-settings/SelectionFieldSettings';
import { RulesCreator } from '../field-controls/rules-creator/RulesCreator';
import { useFormFieldsStore } from '../../hooks/useFormFieldsStore';
import { useShallow } from 'zustand/shallow';
import {
    Field,
    FieldType,
    ControlsMap,
    SettingsMap,
    RuleGroup,
    FieldOption
} from '../../lib/types';

type Props = {
    index: number;
    field: Field;
};

export const FormField = memo(function FormField(props: Props) {
    const { index, field } = props;
    const { setField, deleteField, getLastAddedId, setLastAddedId } = useFormFieldsStore(
        useShallow(state => ({
            setField: state.setField,
            deleteField: state.deleteField,
            getLastAddedId: state.getLastAddedId,
            setLastAddedId: state.setLastAddedId
        }))
    );

    const handleSelect = useCallback(() => {
        if (getLastAddedId() !== null) {
            setLastAddedId(null);
        }
    }, [getLastAddedId, setLastAddedId]);

    const handleTitleChange = useCallback(
        (title: string) => setField(field.id, { title }),
        [field.id, setField]
    );

    const handleTypeChange = useCallback(
        (type: FieldType) => setField(field.id, { type }),
        [field.id, setField]
    );

    const handleDelete = useCallback(() => deleteField(field.id), [field.id, deleteField]);

    const handleControlsChange = useCallback(
        (controls: ControlsMap[FieldType]) => setField(field.id, { controls } as Partial<Field>),
        [field.id, setField]
    );

    const handleSettingsChange = useCallback(
        (settings: SettingsMap[FieldType]) => setField(field.id, { settings } as Partial<Field>),
        [field.id, setField]
    );

    const handleRulesChange = useCallback(
        (rules: RuleGroup) => handleControlsChange({ rules }),
        [handleControlsChange]
    );

    const handleOptionsChange = useCallback(
        (options: FieldOption[]) => handleControlsChange({ options, rules: field.controls.rules }),
        [field.controls.rules, handleControlsChange]
    );

    const getSettingsComponent = () => {
        switch (field.type) {
            case FieldType.TEXT:
                return (
                    <TextFieldSettings
                        settings={field.settings}
                        onSettingsChange={handleSettingsChange}
                    />
                );
            case FieldType.SELECTION:
                return (
                    <SelectionFieldSettings
                        settings={field.settings}
                        onSettingsChange={handleSettingsChange}
                    />
                );
        }
    };

    const getControlsComponent = () => {
        switch (field.type) {
            case FieldType.TEXT:
                return (
                    <RulesCreator
                        fieldId={field.id}
                        fieldType={field.type}
                        rules={field.controls.rules}
                        onRulesChange={handleRulesChange}
                    />
                );
            case FieldType.SELECTION:
                return (
                    <Stack>
                        <RulesCreator
                            fieldId={field.id}
                            fieldType={field.type}
                            rules={field.controls.rules}
                            onRulesChange={handleRulesChange}
                        />
                        <OptionCreator
                            options={field.controls.options}
                            onOptionsChange={handleOptionsChange}
                        />
                    </Stack>
                );
        }
    };

    console.count('rerender');

    return (
        <Draggable draggableId={field.id} index={index}>
            {provided => (
                <Flex
                    direction='column'
                    gap='sm'
                    className='p-lg pl-sm mt-sm rounded-md border-1 border-outline bg-neutral-100'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <FieldHeader
                        title={field.title}
                        selected={getLastAddedId() === field.id}
                        settingsComponent={getSettingsComponent()}
                        dragHandleProps={provided.dragHandleProps}
                        onTitleChange={handleTitleChange}
                        onDelete={handleDelete}
                        onSelect={handleSelect}
                    />
                    <FieldBody
                        fieldType={field.type}
                        onFieldTypeChange={handleTypeChange}
                        controlsComponent={getControlsComponent()}
                    />
                </Flex>
            )}
        </Draggable>
    );
});
