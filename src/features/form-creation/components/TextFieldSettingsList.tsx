import { Stack, Checkbox } from '@mantine/core';
import { ChangeEvent, Ref, useImperativeHandle, useState } from 'react';

export type TextFieldSettings = {
    summarize: boolean;
    analyseSentiment: boolean;
    extractKeywords: boolean;
};

type TextFieldSettingsListProps = {
    settings: TextFieldSettings;
    onSettingsChange: (settings: TextFieldSettings) => void;
};

export function TextFieldSettingsList(props: TextFieldSettingsListProps) {
    const { settings, onSettingsChange } = props;

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
                onChange={e => handleSettingChange('summarize', e)}
            />
            <Checkbox
                label='Analyse sentiment'
                description='Analyze whether responses are positive, negative, neutral or irrelevant'
                checked={settings.analyseSentiment}
                onChange={e => handleSettingChange('analyseSentiment', e)}
            />
            <Checkbox
                label='Extract keywords'
                description='Extract important keywords from user answers'
                checked={settings.extractKeywords}
                onChange={e => handleSettingChange('extractKeywords', e)}
            />
        </Stack>
    );
}
