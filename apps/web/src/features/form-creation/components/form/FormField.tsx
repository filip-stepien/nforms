import { Flex } from '@mantine/core';
import { memo, ReactNode, RefObject, useCallback } from 'react';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import {
    FieldType,
    SettingsMap,
    ControlsMap,
    TextSettings,
    SelectionSettings,
    Field
} from '../../hooks/useFormFields';
import { useOptionCreator } from '../../hooks/useOptionCreator';
import { Draggable } from '@hello-pangea/dnd';
import { FieldHeader } from './FieldHeader';
import { FieldBody } from './FieldBody';
import { SelectionFieldSettings } from '../field-settings/SelectionFieldSettings';
import { ConsistencyRulesCreator } from '../field-controls/ConsistencyRulesCreator';

type Props = {
    index: number;
    field: Field;
    lastAddedFieldIdRef: RefObject<string | null>;
    setField: (id: string, updatedField: Partial<Field>) => void;
    deleteField: (id: string) => void;
};

export const FormField = memo(function FormField(props: Props) {
    const { index, field, lastAddedFieldIdRef, setField, deleteField } = props;

    const handleSelect = useCallback(() => {
        if (lastAddedFieldIdRef) {
            lastAddedFieldIdRef.current = null;
        }
    }, [lastAddedFieldIdRef]);

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

    const optionCreatorProps = useOptionCreator(field.controls?.options, handleControlsChange);

    console.count('rerender');

    const settingsComponent: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: (
            <TextFieldSettings
                settings={field.settings as TextSettings}
                onSettingsChange={handleSettingsChange}
            />
        ),
        [FieldType.SELECTION]: (
            <SelectionFieldSettings
                settings={field.settings as SelectionSettings}
                onSettingsChange={handleSettingsChange}
            />
        )
    };

    const controlsComponent: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: <ConsistencyRulesCreator />,
        [FieldType.SELECTION]: <OptionCreator {...optionCreatorProps} />
    };

    return (
        <Draggable draggableId={field.id} index={index}>
            {provided => (
                <Flex
                    direction='column'
                    gap='sm'
                    className='p-lg pl-sm mt-sm rounded-md border-1 border-outline bg-neutral-50'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <FieldHeader
                        title={field.title}
                        fieldType={field.type}
                        selected={lastAddedFieldIdRef?.current === field.id}
                        settingsComponent={settingsComponent}
                        dragHandleProps={provided.dragHandleProps}
                        onTitleChange={handleTitleChange}
                        onDelete={handleDelete}
                        onSelect={handleSelect}
                    />
                    <FieldBody
                        fieldType={field.type}
                        onFieldTypeChange={handleTypeChange}
                        controlsComponent={controlsComponent}
                    />
                </Flex>
            )}
        </Draggable>
    );
});
