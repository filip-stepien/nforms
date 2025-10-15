import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/providers/AuthGuard';

type Props = {
    children: ReactNode;
};

export default async function ProtectedRouteLayout({ children }: Props) {
    return (
        <AuthGuard>
            <Toaster />
            <Layout>{children}</Layout>
        </AuthGuard>
    );
}
