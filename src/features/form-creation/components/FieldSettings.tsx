import { Menu, ActionIcon, Stack } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { ReactNode, Ref } from 'react';
import { DefaultFieldSettingsList } from './DefaultFieldSettingsList';
import { DefaultFieldSettingsRef, useDefaultFieldSettings } from '../hooks/useDefaultFieldSettings';

type Props = {
    settings?: ReactNode;
    ref?: Ref<DefaultFieldSettingsRef>;
};

export function FieldSettings({ settings, ref }: Props) {
    const { defaultSettings, setDefaultSettings } = useDefaultFieldSettings(ref);

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
