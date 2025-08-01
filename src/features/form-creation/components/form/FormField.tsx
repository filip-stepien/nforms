import { Flex } from '@mantine/core';
import { ReactNode } from 'react';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { BaseFieldSettings } from '../field-settings/BaseFieldSettings';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import { FieldType, SettingsMap, ControlsMap, TextSettings } from '../../hooks/useFormFields';
import { getOptionCreatorProps } from '../../lib/field-controls';
import { Draggable } from '@hello-pangea/dnd';
import { FieldHeader } from './FieldHeader';
import { FieldBody } from './FieldBody';

type Props = {
    id: string;
    index: number;
    title: string;
    type: FieldType;
    settings: SettingsMap[FieldType];
    controls: ControlsMap[FieldType];
    onSettingsChange: (settings: SettingsMap[FieldType]) => void;
    onControlsChange: (controls: ControlsMap[FieldType]) => void;
    onTitleChange: (title: string) => void;
    onFieldTypeChange: (fieldType: FieldType) => void;
    onDelete: () => void;
};

export function FormField(props: Props) {
    const {
        id,
        index,
        title,
        type,
        settings,
        controls,
        onTitleChange,
        onFieldTypeChange,
        onSettingsChange,
        onControlsChange,
        onDelete
    } = props;

    const settingsComponent: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: (
            <TextFieldSettings
                settings={settings as TextSettings}
                onSettingsChange={onSettingsChange}
            />
        ),
        [FieldType.RATING]: (
            <BaseFieldSettings settings={settings} onSettingsChange={onSettingsChange} />
        )
    };

    const controlsComponent: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: null,
        [FieldType.RATING]: (
            <OptionCreator {...getOptionCreatorProps(controls?.options, onControlsChange)} />
        )
    };

    return (
        <Draggable draggableId={id} index={index}>
            {provided => (
                <Flex
                    direction='column'
                    gap='sm'
                    className='p-lg pl-sm mt-sm rounded-md border-1 border-outline bg-neutral-50'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <FieldHeader
                        title={title}
                        fieldType={type}
                        settingsComponent={settingsComponent}
                        dragHandleProps={provided.dragHandleProps}
                        onTitleChange={onTitleChange}
                        onDelete={onDelete}
                    />
                    <FieldBody
                        fieldType={type}
                        onFieldTypeChange={onFieldTypeChange}
                        controlsComponent={controlsComponent}
                    />
                </Flex>
            )}
        </Draggable>
    );
}
