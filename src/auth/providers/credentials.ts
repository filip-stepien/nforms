import CredentialsProvider from 'next-auth/providers/credentials';
import { Provider } from 'next-auth/providers/index';

function getDebugUser(username?: string, password?: string) {
    return username === 'admin' && password === 'admin'
        ? { id: '1', name: 'admin', email: 'admin@example.com' }
        : null;
}

export const credentialsProvider: Provider = CredentialsProvider({
    name: 'Debug credentials',
    credentials: {
        username: {
            label: 'Username',
            placeholder: 'admin',
            type: 'text'
        },
        password: {
            label: 'Password',
            placeholder: 'admin',
            type: 'password'
        }
    },
    async authorize(credentials) {
        return getDebugUser(credentials?.username, credentials?.password);
    }
});
