import { Stack, Switch } from '@mantine/core';
import { ChangeEventHandler } from 'react';

export type DefaultFieldSettings = {
    required: boolean;
};

export type Props = {
    settings?: DefaultFieldSettings;
    onSettingChange?: (settings: DefaultFieldSettings) => void;
};

export function DefaultFieldSettingsList({ settings, onSettingChange }: Props) {
    const handleRequiredChange: ChangeEventHandler<HTMLInputElement> = event => {
        onSettingChange?.({ ...settings, required: event.target.checked });
    };

    return (
        <Stack>
            <Switch
                defaultChecked
                label='Required'
                className='p-sm'
                checked={settings?.required}
                onChange={handleRequiredChange}
            />
        </Stack>
    );
}
