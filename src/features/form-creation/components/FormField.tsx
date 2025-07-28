import { Flex, TextInput, NativeSelect, Checkbox, Stack } from '@mantine/core';
import { ChangeEventHandler, ReactNode, useState } from 'react';
import { FieldSettingsButton } from './FieldSettingsButton';
import { OptionCreator } from './OptionCreator';

export enum FieldType {
    TEXT = 'Text',
    RATING = 'Rating',
    SINGLE_SELECT = 'Single select',
    MULTI_SELECT = 'Multi select'
}

type FieldSetting = {
    fieldType: FieldType;
    settings?: ReactNode[];
    controls?: ReactNode[];
};

type FormFieldProps = {
    onInputTypeChange?: (inputType: FieldType) => void;
};

export function FormField(props: FormFieldProps) {
    const { onInputTypeChange } = props;

    const fieldSettings: FieldSetting[] = [
        {
            fieldType: FieldType.TEXT,
            settings: [
                <Checkbox label='Summarize' description='Generate summaries of user responses' />,
                <Checkbox
                    label='Analyse sentiment'
                    description='Analyze whether responses are positive, negative, neutral or irrelevant'
                />,
                <Checkbox
                    label='Extract keywords'
                    description='Extract important keywords from user answers'
                />
            ]
        },
        {
            fieldType: FieldType.SINGLE_SELECT,
            controls: [<OptionCreator />]
        }
    ];

    const [currentFieldSettings, setCurrentFieldSettings] = useState<FieldSetting | undefined>(
        fieldSettings.at(0)
    );

    const handleInputTypeChange: ChangeEventHandler<HTMLSelectElement> = event => {
        const newFieldType = event.target.value as FieldType;
        onInputTypeChange?.(newFieldType);

        const newFieldSettings = fieldSettings.find(setting => setting.fieldType === newFieldType);
        setCurrentFieldSettings(newFieldSettings);
    };

    return (
        <Flex direction='column' gap='sm' className='w-1/2'>
            <TextInput
                label='Question title'
                placeholder='e.g. How would you describe your experience with our product?'
                className='flex-1'
            />
            <Flex align='end' gap='sm'>
                <NativeSelect
                    label='Input type'
                    data={Object.values(FieldType)}
                    className='flex-1'
                    onChange={handleInputTypeChange}
                />
                <FieldSettingsButton settings={currentFieldSettings?.settings} />
            </Flex>
            <Stack>
                {currentFieldSettings?.controls?.map((control, i) => (
                    <div key={i}>{control}</div>
                ))}
            </Stack>
        </Flex>
    );
}
