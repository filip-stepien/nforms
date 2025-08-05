import { CallbacksOptions } from 'next-auth';

export const session: CallbacksOptions['session'] = async ({ session, token }) => {
    if (token.userId) {
        session.user.id = token.userId;
    }

    return session;
};
