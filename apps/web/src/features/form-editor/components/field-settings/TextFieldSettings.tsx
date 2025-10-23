import { Stack, Checkbox, Divider } from '@mantine/core';
import { ChangeEvent } from 'react';
import { BaseFieldSettings } from './BaseFieldSettings';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectSettingsByFieldId, setSettings } from '../../state/settings';
import { FieldType, FieldSettingsMap } from '@packages/db/schemas/form';

type Props = {
    fieldId: string;
};

export function TextFieldSettings({ fieldId }: Props) {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state =>
        selectSettingsByFieldId<FieldType.TEXT>(state, fieldId)
    );

    const handleTextSettingChange =
        (setting: keyof FieldSettingsMap[FieldType.TEXT]) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            dispatch(
                setSettings<FieldType.TEXT>({
                    fieldId,
                    settings: { [setting]: event.target.checked }
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
