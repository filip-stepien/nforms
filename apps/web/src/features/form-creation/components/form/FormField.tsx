import { Flex, Stack } from '@mantine/core';
import { memo } from 'react';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import { Draggable } from '@hello-pangea/dnd';
import { FieldHeader } from './FieldHeader';
import { FieldBody } from './FieldBody';
import { SelectionFieldSettings } from '../field-settings/SelectionFieldSettings';
import { RulesCreator } from '../field-controls/rules-creator/RulesCreator';
import { Field, FieldType } from '../../lib/types';
import { useFormFieldHandlers } from '../../hooks/useFormFieldHandlers';

type Props = {
    index: number;
    field: Field;
};

export const FormField = memo(function FormField({ index, field }: Props) {
    const {
        isSelected,
        onTitleChange,
        onTypeChange,
        onDelete,
        onOptionsChange,
        onRulesChange,
        onSelect,
        onSettingsChange
    } = useFormFieldHandlers(field);

    const getSettingsComponent = () => {
        switch (field.type) {
            case FieldType.TEXT:
                return (
                    <TextFieldSettings
                        settings={field.settings}
                        onSettingsChange={onSettingsChange}
                    />
                );
            case FieldType.SELECTION:
                return (
                    <SelectionFieldSettings
                        settings={field.settings}
                        onSettingsChange={onSettingsChange}
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
                        onRulesChange={onRulesChange}
                    />
                );
            case FieldType.SELECTION:
                return (
                    <Stack>
                        <RulesCreator
                            fieldId={field.id}
                            fieldType={field.type}
                            rules={field.controls.rules}
                            onRulesChange={onRulesChange}
                        />
                        <OptionCreator
                            options={field.controls.options}
                            onOptionsChange={onOptionsChange}
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
                        selected={isSelected}
                        settingsComponent={getSettingsComponent()}
                        dragHandleProps={provided.dragHandleProps}
                        onTitleChange={onTitleChange}
                        onDelete={onDelete}
                        onSelect={onSelect}
                    />
                    <FieldBody
                        fieldType={field.type}
                        onFieldTypeChange={onTypeChange}
                        controlsComponent={getControlsComponent()}
                    />
                </Flex>
            )}
        </Draggable>
    );
});
