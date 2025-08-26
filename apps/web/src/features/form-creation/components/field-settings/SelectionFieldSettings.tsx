import { Checkbox, Divider, Stack } from '@mantine/core';
import { ChangeEvent } from 'react';
import { BaseSettings, SelectionSettings } from '../../hooks/useFormFields';
import { BaseFieldSettings } from './BaseFieldSettings';

export type Props = {
    settings: SelectionSettings;
    onSettingsChange: (settings: SelectionSettings) => void;
};

export function SelectionFieldSettings({ settings, onSettingsChange }: Props) {
    const handleSelectionSettingChange = (
        setting: keyof SelectionSettings,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        if (settings) {
            onSettingsChange({ ...settings, [setting]: event.target.checked });
        }
    };

    const handleBaseSettingChange = (baseSettings: BaseSettings) => {
        if (settings) {
            onSettingsChange({ ...settings, ...baseSettings });
        }
    };

    return (
        <>
            <BaseFieldSettings settings={settings} onSettingsChange={handleBaseSettingChange} />
            <Divider />
            <Stack>
                <Checkbox
                    label='Single selection'
                    description='Whether only one option should be checked'
                    checked={settings?.singleSelection}
                    onChange={e => handleSelectionSettingChange('singleSelection', e)}
                />
            </Stack>
        </>
    );
}
