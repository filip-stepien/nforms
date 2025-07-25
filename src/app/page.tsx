'use client';

import { Button } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
    const { data } = useSession();

    return data ? (
        <>
            <div>Hello {data.user?.name}</div>
            <Button onClick={() => signOut()}>Sign out</Button>
        </>
    ) : (
        <Button onClick={() => signIn()}>Sign in</Button>
    );
}
