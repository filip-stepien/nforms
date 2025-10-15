'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Session } from 'next-auth';

type Props = {
    session: Session | null;
    children: ReactNode;
};

export function SessionProvider({ children, session }: Props) {
    return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>;
}
