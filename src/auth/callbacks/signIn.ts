import { prisma } from '@/db/prisma';
import { CallbacksOptions } from 'next-auth';
import { z } from 'zod';

const userDetailsSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    providerName: z.string().min(1),
    providerUserId: z.string().min(1)
});

export const signIn: CallbacksOptions['signIn'] = async ({ user, account }) => {
    const authData = {
        name: user?.name,
        email: user?.email,
        providerName: account?.provider,
        providerUserId: account?.providerAccountId
    };

    const { success, data, error } = userDetailsSchema.safeParse(authData);

    if (!success) {
        console.error('Validation failed:', error);
        return false;
    }

    try {
        await prisma.user.upsert({
            where: {
                providerName_providerUserId: {
                    providerName: data.providerName,
                    providerUserId: data.providerUserId
                }
            },
            create: data,
            update: data
        });

        return true;
    } catch (error) {
        console.error('Upsert user error:', error);
        return false;
    }
};
