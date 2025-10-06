import { Switch } from '@mantine/core';
import { ChangeEventHandler } from 'react';
import { BaseSettings } from '../../lib/types';

export type Props = {
    settings: BaseSettings;
    onSettingsChange: (settings: BaseSettings) => void;
};

export function BaseFieldSettings({ settings, onSettingsChange }: Props) {
    const handleRequiredChange: ChangeEventHandler<HTMLInputElement> = event => {
        onSettingsChange({ ...settings, required: event.target.checked });
    };

    return (
        <Switch
            defaultChecked
            label='Required'
            checked={settings?.required}
            onChange={handleRequiredChange}
        />
    );
}
