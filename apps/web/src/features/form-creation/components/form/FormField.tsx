import { Flex } from '@mantine/core';
import { memo, RefObject, useCallback } from 'react';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import { FieldType, SettingsMap, ControlsMap, Field } from '../../hooks/useFormFields';
import { Draggable } from '@hello-pangea/dnd';
import { FieldHeader } from './FieldHeader';
import { FieldBody } from './FieldBody';
import { SelectionFieldSettings } from '../field-settings/SelectionFieldSettings';
import { RulesCreator } from '../field-controls/rules-creator/RulesCreator';
import { useFormFieldsStore } from '../../state/fieldsStore';
import { useShallow } from 'zustand/shallow';

type Props = {
    index: number;
    field: Field;
};

export const FormField = memo(function FormField(props: Props) {
    const { index, field } = props;

    const { setField, deleteField } = useFormFieldsStore(
        useShallow(({ setField, deleteField }) => ({
            setField,
            deleteField
        }))
    );

    // const handleSelect = useCallback(() => {
    //     if (lastAddedFieldIdRef) {
    //         lastAddedFieldIdRef.current = null;
    //     }
    // }, [lastAddedFieldIdRef]);

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
                        field={field}
                        rules={field.controls.rules}
                        onRulesChange={handleControlsChange}
                    />
                );
            case FieldType.SELECTION:
                return (
                    <OptionCreator
                        options={field.controls.options}
                        onOptionsChange={handleControlsChange}
                    />
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
                        //selected={lastAddedFieldIdRef?.current === field.id}
                        selected={false}
                        settingsComponent={getSettingsComponent()}
                        dragHandleProps={provided.dragHandleProps}
                        onTitleChange={handleTitleChange}
                        onDelete={handleDelete}
                        onSelect={() => {}}
                        //onSelect={handleSelect}
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
