'use client';

import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import { Menu } from './Menu';

type Props = {
    children: ReactNode;
};

export function Layout({ children }: Props) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
            className='p-md'
        >
            <AppShell.Header className='flex items-center'>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom='sm'
                    className='pl-md'
                />
            </AppShell.Header>
            <AppShell.Navbar>
                <Menu />
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
