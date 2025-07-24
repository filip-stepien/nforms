import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
    variable: '--font-roboto-sans'
});

export const metadata: Metadata = {
    title: 'App'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${roboto.variable} antialiased`}>{children}</body>
        </html>
    );
}
