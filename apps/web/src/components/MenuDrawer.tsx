import { ActionButton } from '@/features/form-editor/components/ui/ActionButton';
import { Drawer, Stack, Divider } from '@mantine/core';
import { IconSettings, IconLogout, IconPlus, IconListDetails } from '@tabler/icons-react';
import { UserButton } from './UserButton';

type Props = {
    opened: boolean;
    onClose: () => void;
};

export function MenuDrawer({ opened, onClose }: Props) {
    return (
        <Drawer opened={opened} onClose={onClose} title={<span className='font-bold'>Menu</span>}>
            <Stack gap={0}>
                <span className='text-xs font-bold'>Account</span>
                <UserButton />
                <ActionButton
                    icon={IconSettings}
                    label='Settings'
                    variant='transparent'
                    iconSize={18}
                    classNames={{
                        root: 'pl-xs font-normal text-font-secondary text-xs'
                    }}
                />
                <ActionButton
                    icon={IconLogout}
                    label='Sign out'
                    variant='transparent'
                    iconSize={18}
                    classNames={{
                        root: 'pl-xs text-danger font-normal text-xs'
                    }}
                />
                <Divider className='my-sm' />
                <span className='text-xs font-bold'>Form</span>
                <ActionButton
                    icon={IconPlus}
                    label='Create new'
                    variant='transparent'
                    iconSize={18}
                    classNames={{
                        root: 'pl-xs font-normal text-font-secondary text-xs'
                    }}
                />
                <ActionButton
                    icon={IconListDetails}
                    label='Your forms'
                    variant='transparent'
                    iconSize={18}
                    classNames={{
                        root: 'pl-xs font-normal text-font-secondary text-xs'
                    }}
                />
            </Stack>
        </Drawer>
    );
}
