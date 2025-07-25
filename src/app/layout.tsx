import './globals.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { getServerSession } from 'next-auth';
import Providers from './providers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

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
                <Providers session={session}>{children}</Providers>
            </body>
        </html>
    );
}
