import { Stack, Checkbox, Divider } from '@mantine/core';
import { ChangeEvent } from 'react';
import { BaseFieldSettings } from './BaseFieldSettings';
import { FieldType, SettingsMap } from '../../lib/types';
import { selectFieldById, setField } from '../../state/formFieldsSlice';
import { useFormDispatch } from '../../hooks/useFormDispatch';
import { useFormSelector } from '../../hooks/useFormSelector';

type Props = {
    fieldId: string;
};

export function TextFieldSettings({ fieldId }: Props) {
    const dispatch = useFormDispatch();
    const settings = useFormSelector(
        state => selectFieldById<FieldType.TEXT>(state, fieldId).settings
    );

    const handleTextSettingChange =
        (setting: keyof SettingsMap[FieldType.TEXT]) => (event: ChangeEvent<HTMLInputElement>) => {
            dispatch(
                setField<FieldType.TEXT>({
                    fieldId,
                    field: { settings: { [setting]: event.target.checked } }
                })
            );
        };

    return (
        <>
            <BaseFieldSettings fieldId={fieldId} />
            <Divider />
            <Stack>
                <Checkbox
                    label='Summarize'
                    description='Generate summaries of user responses'
                    checked={settings.summarize}
                    onChange={handleTextSettingChange('summarize')}
                />
                <Checkbox
                    label='Analyse sentiment'
                    description='Analyze whether responses are positive, negative, neutral or irrelevant'
                    checked={settings.analyseSentiment}
                    onChange={handleTextSettingChange('analyseSentiment')}
                />
                <Checkbox
                    label='Extract keywords'
                    description='Extract important keywords from user answers'
                    checked={settings.extractKeywords}
                    onChange={handleTextSettingChange('extractKeywords')}
                />
            </Stack>
        </>
    );
}
