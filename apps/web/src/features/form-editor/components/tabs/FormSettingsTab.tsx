import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Stack, Switch } from '@mantine/core';
import { ChangeEventHandler } from 'react';
import { setFormSettings } from '../../state/form';
import { FormSettings as FormSettingsType } from '@packages/db/schemas/form/form';

export function FormSettingsTab() {
    const settings = useAppSelector(state => state.form.settings);
    const dispatch = useAppDispatch();

    const handleSettingChange =
        (setting: keyof FormSettingsType): ChangeEventHandler<HTMLInputElement> =>
        event => {
            dispatch(setFormSettings({ [setting]: event.target.checked }));
        };

    const handleSingleResponseChange: ChangeEventHandler<HTMLInputElement> = event => {
        const value = event.target.checked;

        dispatch(
            setFormSettings({
                singleResponse: value,
                ...(value && { anonymous: false })
            })
        );
    };

    return (
        <Stack gap='md'>
            <Switch
                label='Active'
                description='Allow users to submit responses.'
                onChange={handleSettingChange('active')}
                checked={settings.active}
            />
            <Switch
                label='Single response'
                description='Prevent users from submitting more than once.'
                onChange={handleSingleResponseChange}
                checked={settings.singleResponse}
            />

            <Switch
                label='Anonymous'
                description={
                    settings.singleResponse
                        ? 'Disabled because only one response per user is allowed.'
                        : 'Submissions without requiring personal information.'
                }
                disabled={settings.singleResponse}
                onChange={handleSettingChange('anonymous')}
                checked={settings.singleResponse ? false : settings.anonymous}
            />
        </Stack>
    );
}
