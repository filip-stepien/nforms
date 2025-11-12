import { Divider, Menu, Stack, UnstyledButton } from '@mantine/core';
import Avatar from 'react-avatar';
import { ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Icon, IconLogout, IconSettings } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

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
        <Menu position='bottom-end' width={220} withArrow classNames={{ dropdown: 'shadow-sm' }}>
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

type Props = {
    withDivider?: boolean;
    withMenu?: boolean;
};

export function UserButton({ withDivider = false, withMenu = false }: Props) {
    const { data } = useSession();

    const button = (
        <UnstyledButton
            className={cn(
                'gap-sm p-xs flex items-center',
                !withMenu && 'pointer-none cursor-default'
            )}
        >
            {withDivider && <Divider orientation='vertical' />}
            <Avatar name={data?.user?.name ?? ''} size='32px' round />
            <Stack gap={0}>
                <div className='text-xs font-medium'>{data?.user?.name}</div>
                <div className='font-lighter text-font-secondary text-xs'>{data?.user?.email}</div>
            </Stack>
        </UnstyledButton>
    );

    return withMenu ? <UserMenu>{button}</UserMenu> : button;
}
