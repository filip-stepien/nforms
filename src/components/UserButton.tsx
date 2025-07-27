import { Flex, Menu, UnstyledButton } from '@mantine/core';
import Avatar from 'react-avatar';
import { ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    Icon,
    IconChevronRight,
    IconLogout,
    IconSettings
} from '@tabler/icons-react';

const USER_MENU_ENTRIES: UserMenuEntry[] = [
    {
        label: 'Account',
        items: [
            {
                icon: IconSettings,
                title: 'Settings',
                onClick: ''
            },
            {
                icon: IconLogout,
                title: 'Sign out',
                danger: true,
                onClick: signOut
            }
        ]
    }
];

type UserMenuItem = {
    icon: Icon;
    title: string;
    onClick: string | (() => void);
    danger?: boolean;
};

type UserMenuEntry = {
    label: string;
    items: UserMenuItem[];
};

function UserMenuItemElement({ item }: { item: UserMenuItem }) {
    const { icon: Icon, title, danger, onClick } = item;
    const isLink = typeof onClick === 'string';

    const menuItem = (
        <Menu.Item
            leftSection={<Icon size={14} />}
            color={danger ? 'red' : undefined}
            onClick={isLink ? undefined : onClick}
        >
            {title}
        </Menu.Item>
    );

    return isLink ? (
        <Link href={onClick} key={title}>
            {menuItem}
        </Link>
    ) : (
        <div key={title}>{menuItem}</div>
    );
}

function UserMenu({ children }: { children: ReactNode }) {
    return (
        <Menu
            position='right-start'
            offset={12}
            width={300}
            classNames={{ dropdown: 'mt-sm' }}
            withArrow
        >
            <Menu.Target>{children}</Menu.Target>
            <Menu.Dropdown>
                {USER_MENU_ENTRIES.map(({ label, items }) => (
                    <div key={label}>
                        <Menu.Label>{label}</Menu.Label>
                        {items.map(item => (
                            <UserMenuItemElement key={item.title} item={item} />
                        ))}
                    </div>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}

export function UserButton() {
    const { data } = useSession();

    return (
        <UserMenu>
            <UnstyledButton className='p-sm hover:bg-hover flex gap-sm items-center'>
                <Avatar name={data?.user?.name ?? ''} size='40px' round />
                <Flex direction='column' flex={1}>
                    <div className='text-sm font-medium'>
                        {data?.user?.name}
                    </div>
                    <div className='text-sm font-lighter text-font-secondary'>
                        {data?.user?.email}
                    </div>
                </Flex>
                <IconChevronRight
                    size={14}
                    stroke={1.5}
                    className='justify-self-end'
                />
            </UnstyledButton>
        </UserMenu>
    );
}
