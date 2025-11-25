'use client';

import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';
import { Header } from './Header';

type Props = {
    children: ReactNode;
};

export function Layout({ children }: Props) {
    return (
        <AppShell
            header={{ height: 60 }}
            classNames={{
                main: 'pt-[60px] md:pt-[calc(60px+var(--spacing-md))] lg:pt-[calc(60px+var(--spacing-xl))] pb-xl w-full md:w-5/6 xl:w-3/4',
                header: 'flex items-center border-b-1 md:border-0 border-outline md:shadow-xs border-0',
                root: 'bg-neutral-200 flex justify-center'
            }}
        >
            <AppShell.Header>
                <Header />
            </AppShell.Header>
            <AppShell.Main>
                <div className='p-md md:p-xl min-h-[calc(100dvh-60px-2*var(--spacing-xl))] bg-white shadow-md md:rounded-md'>
                    {children}
                </div>
            </AppShell.Main>
        </AppShell>
    );
}
