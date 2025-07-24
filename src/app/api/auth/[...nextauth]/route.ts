import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

function getDebugUser(username?: string, password?: string) {
    const credentials = {
        username: 'admin',
        password: 'admin'
    };

    const valid =
        credentials.username === username && credentials.password === password;

    return valid ? { id: '1', name: credentials.username } : null;
}

const handler = NextAuth({
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Username',
                    type: 'text',
                    placeholder: 'jsmith'
                },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                return getDebugUser(
                    credentials?.username,
                    credentials?.password
                );
            }
        })
    ]
});

export { handler as GET, handler as POST };
