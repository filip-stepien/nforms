import { Stack, Checkbox } from '@mantine/core';
import { ChangeEvent } from 'react';

export type TextFieldSettings = {
    summarize: boolean;
    analyseSentiment: boolean;
    extractKeywords: boolean;
};

type Props = {
    settings: TextFieldSettings;
    onSettingsChange: (settings: TextFieldSettings) => void;
};

export function TextFieldSettingsList({ settings, onSettingsChange }: Props) {
    const handleSettingChange = (
        setting: keyof TextFieldSettings,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        onSettingsChange({ ...settings, [setting]: event.target.checked });
    };

    return (
        <Stack>
            <Checkbox
                label='Summarize'
                description='Generate summaries of user responses'
                checked={settings.summarize}
                onChange={event => handleSettingChange('summarize', event)}
            />
            <Checkbox
                label='Analyse sentiment'
                description='Analyze whether responses are positive, negative, neutral or irrelevant'
                checked={settings.analyseSentiment}
                onChange={event => handleSettingChange('analyseSentiment', event)}
            />
            <Checkbox
                label='Extract keywords'
                description='Extract important keywords from user answers'
                checked={settings.extractKeywords}
                onChange={event => handleSettingChange('extractKeywords', event)}
            />
        </Stack>
    );
}
