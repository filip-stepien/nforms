import 'server-only';

import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession, User } from 'next-auth';
import authOptions from './config';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import z from 'zod';

const envSchema = z.object({ SIGN_IN_URL: z.url().nonempty('Missing SIGN_IN_URL') });
const env = envSchema.parse(process.env);

export const getAuthSession = cache(
    async (
        ...args:
            | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
            | [NextApiRequest, NextApiResponse]
            | []
    ) => {
        return getServerSession(...args, authOptions);
    }
);

export const verifyUser = cache(async (): Promise<User> => {
    const session = await getAuthSession();

    if (session?.user) {
        return session?.user;
    } else {
        redirect(env.SIGN_IN_URL);
    }
});
