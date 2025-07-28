import { ReactNode, useCallback, useRef, useState } from 'react';
import { OptionCreator } from '../components/OptionCreator';
import { TextFieldSettings, TextFieldSettingsList } from '../components/TextFieldSettingsList';
import { DefaultFieldSettings } from '../components/DefaultFieldSettingsList';
import { DefaultFieldSettingsRef } from './useDefaultFieldSettings';
import { OptionCreatorRef } from './useOptionCreator';

export enum FieldType {
    TEXT = 'Text',
    RATING = 'Rating',
    SINGLE_SELECT = 'Single select',
    MULTI_SELECT = 'Multi select'
}

export type FieldSettingsMap = {
    [FieldType.TEXT]: DefaultFieldSettings & TextFieldSettings;
    [FieldType.SINGLE_SELECT]: DefaultFieldSettings;
    [FieldType.RATING]: DefaultFieldSettings;
    [FieldType.MULTI_SELECT]: DefaultFieldSettings;
};

type FieldConfig = Record<
    FieldType,
    {
        settings?: ReactNode;
        controls?: ReactNode;
    }
>;

export function useFormFieldConfiguration(currentFieldType: FieldType) {
    const defaultSettingsRef = useRef<DefaultFieldSettingsRef>(null);
    const optionCreatorRef = useRef<OptionCreatorRef>(null);

    const [textFieldSettings, setTextFieldSettings] = useState<TextFieldSettings>({
        analyseSentiment: true,
        extractKeywords: true,
        summarize: true
    });

    const fieldConfig: FieldConfig = {
        [FieldType.TEXT]: {
            settings: (
                <TextFieldSettingsList
                    settings={textFieldSettings}
                    onSettingsChange={setTextFieldSettings}
                />
            )
        },
        [FieldType.SINGLE_SELECT]: {
            controls: <OptionCreator ref={optionCreatorRef} />
        },
        [FieldType.MULTI_SELECT]: {
            controls: <OptionCreator ref={optionCreatorRef} />
        },
        [FieldType.RATING]: {}
    };

    const getOptions = useCallback(() => optionCreatorRef.current?.getOptions() ?? null, []);

    const getSettings = useCallback(() => {
        const defaultSettings = defaultSettingsRef.current?.getDefaultSettings();

        if (!defaultSettings) {
            return null;
        }

        switch (currentFieldType) {
            case FieldType.TEXT:
                return { ...defaultSettings, ...textFieldSettings };
            default:
                return defaultSettings;
        }
    }, [currentFieldType, textFieldSettings]);

    return {
        getSettings,
        getOptions,
        defaultSettingsRef,
        settingsComponent: fieldConfig[currentFieldType].settings ?? null,
        controlsComponent: fieldConfig[currentFieldType].controls ?? null
    };
}
