import '@/styles/globals.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Layout } from '@/components/Layout';
import Providers from '@/components/Providers';
import authOptions from '@/auth/config';
import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';

type Props = {
    children: ReactNode;
};

export const metadata: Metadata = {
    title: 'App'
};

export default async function RootLayout({ children }: Props) {
    const session = await getServerSession(authOptions);

    return (
        <html lang='en' {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <Toaster />
                <Providers session={session}>
                    <Layout>{children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
