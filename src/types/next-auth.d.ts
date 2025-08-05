/* eslint-disable-next-line unused-imports/no-unused-imports */
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
        };
    }

    interface User {
        id: string;
        email: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: string;
    }
}
