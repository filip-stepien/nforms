import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserSessionProvider } from '@/providers/UserSessionProvider';
import { getAuthSession } from '@/auth';
import { Layout } from '@/components/Layout';

type Props = {
    children: ReactNode;
};

export default async function ProtectedRouteLayout({ children }: Props) {
    return (
        <UserSessionProvider session={await getAuthSession()}>
            <Toaster />
            <Layout>{children}</Layout>
        </UserSessionProvider>
    );
}
