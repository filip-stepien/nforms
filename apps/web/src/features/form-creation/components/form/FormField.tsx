import { Flex } from '@mantine/core';
import { ReactNode } from 'react';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import {
    FieldType,
    SettingsMap,
    ControlsMap,
    TextSettings,
    SelectionSettings
} from '../../hooks/useFormFields';
import { useOptionCreator } from '../../hooks/useOptionCreator';
import { Draggable } from '@hello-pangea/dnd';
import { FieldHeader } from './FieldHeader';
import { FieldBody } from './FieldBody';
import { SelectionFieldSettings } from '../field-settings/SelectionFieldSettings';
import { ConsistencyRulesCreator } from '../field-controls/ConsistencyRulesCreator';

type Props = {
    id: string;
    index: number;
    title: string;
    type: FieldType;
    selected?: boolean;
    settings: SettingsMap[FieldType];
    controls: ControlsMap[FieldType];
    onSelect: () => void;
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
        selected,
        settings,
        controls,
        onSelect,
        onTitleChange,
        onFieldTypeChange,
        onSettingsChange,
        onControlsChange,
        onDelete
    } = props;

    const optionCreatorProps = useOptionCreator(controls?.options, onControlsChange);

    const settingsComponent: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: (
            <TextFieldSettings
                settings={settings as TextSettings}
                onSettingsChange={onSettingsChange}
            />
        ),
        [FieldType.SELECTION]: (
            <SelectionFieldSettings
                settings={settings as SelectionSettings}
                onSettingsChange={onSettingsChange}
            />
        )
    };

    const controlsComponent: Record<FieldType, ReactNode> = {
        [FieldType.TEXT]: <ConsistencyRulesCreator />,
        [FieldType.SELECTION]: <OptionCreator {...optionCreatorProps} />
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
                        selected={selected}
                        settingsComponent={settingsComponent}
                        dragHandleProps={provided.dragHandleProps}
                        onTitleChange={onTitleChange}
                        onDelete={onDelete}
                        onSelect={onSelect}
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
