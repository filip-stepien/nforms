'use client';

import { MantineProvider } from '@mantine/core';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

type Props = {
    session: Session | null;
    children: React.ReactNode;
};

export default function Providers({ session, children }: Props) {
    return (
        <SessionProvider session={session}>
            <MantineProvider>{children}</MantineProvider>
        </SessionProvider>
    );
}
