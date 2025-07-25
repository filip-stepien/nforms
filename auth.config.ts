import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { AuthOptions } from 'next-auth';
import { z } from 'zod';

const envSchema = z.object({
    KEYCLOAK_ISSUER: z.string().min(1, 'Missing KEYCLOAK_ISSUER'),
    KEYCLOAK_CLIENT_ID: z.string().min(1, 'Missing KEYCLOAK_CLIENT_ID'),
    KEYCLOAK_CLIENT_SECRET: z.string().min(1, 'Missing KEYCLOAK_CLIENT_SECRET')
});

const env = envSchema.parse(process.env);

function getDebugUser(username?: string, password?: string) {
    return username === 'admin' && password === 'admin'
        ? { id: '1', name: 'admin' }
        : null;
}

const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 3600 // seconds
    },
    providers: [
        CredentialsProvider({
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
                return getDebugUser(
                    credentials?.username,
                    credentials?.password
                );
            }
        }),
        KeycloakProvider({
            clientId: env.KEYCLOAK_CLIENT_ID,
            clientSecret: env.KEYCLOAK_CLIENT_SECRET,
            issuer: env.KEYCLOAK_ISSUER
        })
    ]
};

export default authOptions;
