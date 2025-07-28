import { Menu, ActionIcon, Stack } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { ReactNode, Ref, useImperativeHandle, useState } from 'react';
import { DefaultFieldSettings, DefaultFieldSettingsList } from './DefaultFieldSettingsList';
import { TextFieldSettings } from './TextFieldSettingsList';

export type DefaultFieldSettingsRef = {
    getDefaultSettings: () => DefaultFieldSettings;
};

export type TextFieldSettingsRef = {
    getSettings: () => TextFieldSettings;
};

type FieldSettingsButtonProps = {
    settings?: ReactNode;
    ref?: Ref<DefaultFieldSettingsRef>;
};

export function FieldSettingsButton({ settings, ref }: FieldSettingsButtonProps) {
    const [defaultSettings, setDefaultSettings] = useState<DefaultFieldSettings>({
        required: true
    });

    useImperativeHandle(
        ref,
        () => ({
            getDefaultSettings: () => defaultSettings
        }),
        [defaultSettings]
    );

    return (
        <Menu shadow='md' width={300} position='bottom-end'>
            <Menu.Target>
                <ActionIcon variant='filled' className='size-[36px]'>
                    <IconAdjustments stroke={1.5} size={20} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Input settings</Menu.Label>
                <DefaultFieldSettingsList
                    settings={defaultSettings}
                    onSettingChange={setDefaultSettings}
                />
                {settings && (
                    <>
                        <Menu.Divider />
                        <Stack className='p-sm'>{settings}</Stack>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}
