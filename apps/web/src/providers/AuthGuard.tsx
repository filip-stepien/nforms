import authOptions from '@/auth/config';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SessionProvider } from './SessionProvider';
import { ReactNode } from 'react';
import { env } from '@packages/env';

type Props = {
    children: ReactNode;
};

export async function AuthGuard({ children }: Props) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect(env.SIGN_IN_URL);
    }

    return <SessionProvider session={session}>{children}</SessionProvider>;
}
