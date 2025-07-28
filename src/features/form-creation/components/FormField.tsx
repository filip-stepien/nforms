import { Flex, TextInput, NativeSelect, Stack } from '@mantine/core';
import { ChangeEventHandler, ReactNode, useImperativeHandle, useRef, useState, Ref } from 'react';
import { DefaultFieldSettingsRef, FieldSettingsButton } from './FieldSettingsButton';
import { FieldOption, OptionCreator, OptionCreatorRef } from './OptionCreator';
import { DefaultFieldSettings } from './DefaultFieldSettingsList';
import { TextFieldSettings, TextFieldSettingsList } from './TextFieldSettingsList';

export enum FieldType {
    TEXT = 'Text',
    RATING = 'Rating',
    SINGLE_SELECT = 'Single select',
    MULTI_SELECT = 'Multi select'
}

export type FormFieldRef = {
    getTitle: () => string;
    getType: () => FieldType;
    getSettings: () => DefaultFieldSettings | (DefaultFieldSettings & TextFieldSettings) | null;
    getOptions: () => FieldOption[] | null;
};

type FieldSetting = {
    fieldType: FieldType;
    settings?: ReactNode;
    controls?: ReactNode;
};

export function FormField({ ref }: { ref?: Ref<FormFieldRef> }) {
    const [textFieldSettings, setTextFieldSettings] = useState<TextFieldSettings>({
        analyseSentiment: true,
        extractKeywords: true,
        summarize: true
    });

    const titleRef = useRef<HTMLInputElement>(null);
    const defaultSettingsRef = useRef<DefaultFieldSettingsRef>(null);
    const optionCreatorRef = useRef<OptionCreatorRef>(null);

    const fieldSettings: FieldSetting[] = [
        {
            fieldType: FieldType.TEXT,
            settings: (
                <TextFieldSettingsList
                    settings={textFieldSettings}
                    onSettingsChange={setTextFieldSettings}
                />
            )
        },
        {
            fieldType: FieldType.SINGLE_SELECT,
            controls: <OptionCreator ref={optionCreatorRef} />
        }
    ];

    const [currentFieldType, setCurrentFieldType] = useState<FieldType>(FieldType.TEXT);
    const currentFieldSettings = fieldSettings.find(
        setting => setting.fieldType === currentFieldType
    );

    useImperativeHandle(
        ref,
        () => ({
            getTitle: () => titleRef.current?.value ?? '',
            getType: () => currentFieldType,
            getOptions: () => optionCreatorRef.current?.getOptions() ?? null,
            getSettings: () => {
                const defaultSettings = defaultSettingsRef.current?.getDefaultSettings();

                if (!defaultSettings) {
                    return null;
                }

                return currentFieldType === FieldType.TEXT
                    ? { ...defaultSettings, ...textFieldSettings }
                    : defaultSettings;
            }
        }),
        [currentFieldType]
    );

    const handleInputTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
        setCurrentFieldType(event.target.value as FieldType);
    };

    return (
        <Flex direction='column' gap='sm' className='w-1/2'>
            <TextInput
                label='Question title'
                placeholder='e.g. How would you describe your experience with our product?'
                className='flex-1'
                ref={titleRef}
            />
            <Flex align='end' gap='sm'>
                <NativeSelect
                    label='Input type'
                    data={Object.values(FieldType)}
                    className='flex-1'
                    onChange={handleInputTypeChange}
                />
                <FieldSettingsButton
                    ref={defaultSettingsRef}
                    settings={currentFieldSettings?.settings}
                />
            </Flex>
            <Stack>{currentFieldSettings?.controls}</Stack>
        </Flex>
    );
}
