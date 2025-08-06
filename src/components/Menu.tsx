import { ActionIcon, Divider, Flex, Group, Tooltip } from '@mantine/core';
import { UserButton } from './UserButton';
import { Icon, IconClipboardData, IconDashboard, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

const MENU_ITEMS: MenuItemProps[] = [
    {
        icon: IconDashboard,
        title: 'Dashboard',
        href: '/'
    },
    {
        icon: IconClipboardData,
        title: 'Your forms',
        href: 'your-forms'
    }
];

export type MenuFormItemProps = {
    title: string;
    href: string;
};

type MenuItemProps = {
    icon: Icon;
    title: string;
    href: string;
};

type MenuProps = {
    menuFormItems?: MenuFormItemProps[];
};

function MenuItem({ icon: Icon, title, href }: MenuItemProps) {
    return (
        <Link href={href}>
            <Group className='text-xs hover:bg-hover p-2 rounded-md'>
                <Icon size={20} stroke={1.5} className='text-icon' />
                <div className='text-font-secondary'>{title}</div>
            </Group>
        </Link>
    );
}

function MenuFormItem({ title, href }: MenuFormItemProps) {
    return (
        <Link href={href}>
            <Group className='text-xs hover:bg-hover p-2 rounded-md'>
                <div>{title}</div>
            </Group>
        </Link>
    );
}

export function Menu({ menuFormItems = [] }: MenuProps) {
    return (
        <Flex direction='column'>
            <UserButton />
            <Divider className='mt-0' />
            <Flex direction='column' className='p-sm'>
                {MENU_ITEMS.map((item, i) => (
                    <MenuItem key={i} icon={item.icon} title={item.title} href={item.href} />
                ))}
            </Flex>
            <Divider className='mt-0' />
            <Flex direction='column' className='p-sm'>
                <Flex justify='space-between' className='pb-1'>
                    <span className='text-xs text-font-secondary pl-1'>Last forms</span>
                    <Tooltip label='Create new form' withArrow position='right'>
                        <Link href='create-form'>
                            <ActionIcon variant='default' size={18}>
                                <IconPlus size={12} stroke={1.5} />
                            </ActionIcon>
                        </Link>
                    </Tooltip>
                </Flex>
                {menuFormItems.length === 0 ? (
                    <span className='pl-1 pt-1 text-xs text-font-secondary'>
                        You haven’t created any forms yet.
                    </span>
                ) : (
                    menuFormItems.map((item, i) => (
                        <MenuFormItem key={i} title={item.title} href={item.href} />
                    ))
                )}
            </Flex>
        </Flex>
    );
}
