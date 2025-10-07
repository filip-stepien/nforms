import { Checkbox, Divider, Stack } from '@mantine/core';
import { ChangeEvent } from 'react';
import { BaseFieldSettings } from './BaseFieldSettings';
import { SelectionSettings, FieldUpdater } from '../../lib/types';

export type Props = {
    settings: SelectionSettings;
    onFieldChange: FieldUpdater;
};

export function SelectionFieldSettings({ settings, onFieldChange }: Props) {
    const handleSelectionSettingChange = (
        setting: keyof SelectionSettings,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        if (settings) {
            onFieldChange(prev => ({
                ...prev,
                settings: { ...settings, [setting]: event.target.checked }
            }));
        }
    };

    return (
        <>
            <BaseFieldSettings settings={settings} onFieldChange={onFieldChange} />
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
