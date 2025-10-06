import { Stack, Checkbox, Divider } from '@mantine/core';
import { ChangeEvent } from 'react';
import { BaseFieldSettings } from './BaseFieldSettings';
import { TextSettings, BaseSettings } from '../../lib/types';

type Props = {
    settings: TextSettings;
    onSettingsChange: (settings: TextSettings) => void;
};

export function TextFieldSettings({ settings, onSettingsChange }: Props) {
    const handleTextSettingChange = (
        setting: keyof TextSettings,
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
                    label='Summarize'
                    description='Generate summaries of user responses'
                    checked={settings?.summarize}
                    onChange={e => handleTextSettingChange('summarize', e)}
                />
                <Checkbox
                    label='Analyse sentiment'
                    description='Analyze whether responses are positive, negative, neutral or irrelevant'
                    checked={settings?.analyseSentiment}
                    onChange={e => handleTextSettingChange('analyseSentiment', e)}
                />
                <Checkbox
                    label='Extract keywords'
                    description='Extract important keywords from user answers'
                    checked={settings?.extractKeywords}
                    onChange={e => handleTextSettingChange('extractKeywords', e)}
                />
            </Stack>
        </>
    );
}
