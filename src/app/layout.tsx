import '@/globals.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Layout } from '@/components/Layout';
import Providers from '@/components/Providers';

type Props = {
    children: ReactNode;
};

export const metadata: Metadata = {
    title: 'App'
};

export default async function RootLayout({ children }: Props) {
    const session = await getServerSession();

    return (
        <html lang='en' {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <Providers session={session}>
                    <Layout>{children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
