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
            classNames={{
                main: 'mx-lg pt-[calc(60px+var(--spacing-lg))]',
                header: 'flex items-center'
            }}
        >
            <AppShell.Header>
                <Burger opened={opened} onClick={toggle} hiddenFrom='sm' className='pl-md' />
            </AppShell.Header>
            <AppShell.Navbar>
                <Menu />
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
