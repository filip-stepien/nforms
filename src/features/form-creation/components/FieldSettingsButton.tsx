import { Menu, ActionIcon, Switch, Stack } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { ReactNode } from 'react';

type FieldSettingsButtonProps = {
    settings?: ReactNode[];
};

export function FieldSettingsButton({ settings }: FieldSettingsButtonProps) {
    return (
        <Menu shadow='md' width={300} position='bottom-end'>
            <Menu.Target>
                <ActionIcon variant='filled' className='size-[36px]'>
                    <IconAdjustments stroke={1.5} size={20} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Input settings</Menu.Label>
                <Switch defaultChecked label='Required' className='p-sm' />
                {settings && (
                    <>
                        <Menu.Divider />
                        <Stack className='p-sm'>
                            {settings?.map((opt, i) => (
                                <div key={i}>{opt}</div>
                            ))}
                        </Stack>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}
