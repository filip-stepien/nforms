import { Flex, TextInput, NativeSelect, Stack, Menu } from '@mantine/core';
import { ChangeEventHandler, ReactNode } from 'react';
import { IconAdjustments, IconTrash } from '@tabler/icons-react';
import { IconButton } from '../ui/IconButton';
import { TextFieldSettings } from '../field-settings/TextFieldSettings';
import { BaseFieldSettings } from '../field-settings/BaseFieldSettings';
import { OptionCreator } from '../field-controls/option-creator/OptionCreator';
import { FieldType, SettingsMap, ControlsMap, TextSettings } from '../../hooks/useFormFields';
import { getOptionCreatorProps } from '../../lib/field-controls';

type Props = {
    title: string;
    fieldType: FieldType;
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
        title,
        fieldType,
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

    const handleInputTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
        onFieldTypeChange(event.target.value as FieldType);
    };

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = event => {
        onTitleChange(event.target.value);
    };

    return (
        <Flex direction='column' gap='sm' className='w-1/2'>
            <TextInput
                label='Question title'
                placeholder='e.g. How would you describe your experience with our product?'
                className='flex-1'
                value={title}
                onChange={handleTitleChange}
            />
            <Flex align='end' gap='sm'>
                <NativeSelect
                    label='Input type'
                    defaultValue={fieldType}
                    data={Object.values(FieldType)}
                    className='flex-1'
                    onChange={handleInputTypeChange}
                />
                {fieldType && settingsComponent[fieldType] && (
                    <Menu shadow='md' width={300} position='bottom-end'>
                        <Menu.Target>
                            <IconButton variant='light' icon={IconAdjustments} />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Field settings</Menu.Label>
                            <Stack className='p-sm'>{settingsComponent[fieldType]}</Stack>
                        </Menu.Dropdown>
                    </Menu>
                )}
                <IconButton icon={IconTrash} variant='light' color='red' onClick={onDelete} />
            </Flex>
            {fieldType && controlsComponent[fieldType] && (
                <Stack>{controlsComponent[fieldType]}</Stack>
            )}
        </Flex>
    );
}
