import { prisma } from '@packages/db';
import { Account, CallbacksOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

async function addUserIdPayload(token: JWT, account: Account | null) {
    if (!account) {
        return token;
    }

    const { provider: providerName, providerAccountId: providerUserId } = account;
    if (!providerName || !providerUserId) {
        return token;
    }

    try {
        const user = await prisma.user.findFirst({
            where: { providerName, providerUserId }
        });

        if (user) {
            token.userId = user.id;
        }
    } catch (err) {
        console.error('Error fetching user while adding user ID to JWT payload.', err);
    }

    return token;
}

export const jwt: CallbacksOptions['jwt'] = async ({ token, account }) => {
    return addUserIdPayload(token, account);
};
