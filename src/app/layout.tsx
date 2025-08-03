import '@/globals.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Layout } from '@/components/Layout';
import Providers from '@/components/Providers';
import { prisma } from '@/db/prisma';

type Props = {
    children: ReactNode;
};

export const metadata: Metadata = {
    title: 'App'
};

async function testDatabase() {
    const id = '60cc9b0e001e3bfd00a6eddf';
    const name = 'Created at ' + new Date().toLocaleString();
    try {
        await prisma.$connect();
        await prisma.user.upsert({
            where: { id },
            update: { name },
            create: { id, name }
        });
        console.log('Added test user.', name);
    } catch (e) {
        console.error(e);
    }
}

export default async function RootLayout({ children }: Props) {
    const session = await getServerSession();

    await testDatabase();

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
