import { Stack, Checkbox, Divider } from '@mantine/core';
import { ChangeEvent } from 'react';
import { BaseFieldSettings } from './BaseFieldSettings';
import { TextSettings, FieldUpdater } from '../../lib/types';

type Props = {
    settings: TextSettings;
    onFieldChange: FieldUpdater;
};

export function TextFieldSettings({ settings, onFieldChange }: Props) {
    const handleTextSettingChange = (
        setting: keyof TextSettings,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        if (settings) {
            onFieldChange(prev => ({
                ...prev,
                settings: { ...prev.settings, [setting]: event.target.checked }
            }));
        }
    };

    return (
        <>
            <BaseFieldSettings settings={settings} onFieldChange={onFieldChange} />
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
