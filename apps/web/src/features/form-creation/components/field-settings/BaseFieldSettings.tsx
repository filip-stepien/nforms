import { Switch } from '@mantine/core';
import { ChangeEventHandler } from 'react';
import { BaseSettings, FieldUpdater } from '../../lib/types';

export type Props = {
    settings: BaseSettings;
    onFieldChange: FieldUpdater;
};

export function BaseFieldSettings({ settings, onFieldChange }: Props) {
    const handleRequiredChange: ChangeEventHandler<HTMLInputElement> = event => {
        onFieldChange(prev => ({
            ...prev,
            settings: { ...prev.settings, required: event.target.checked }
        }));
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
