import '@/styles/globals.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components/Layout';
import Providers from '@/components/Providers';
import { getAuthSession } from '@/auth';

type Props = {
    children: ReactNode;
};

export const metadata: Metadata = {
    title: 'App'
};

export default async function RootLayout({ children }: Props) {
    const session = await getAuthSession();

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
