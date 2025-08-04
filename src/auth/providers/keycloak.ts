import { Provider } from 'next-auth/providers/index';
import { z } from 'zod';
import KeycloakProvider from 'next-auth/providers/keycloak';

const envSchema = z.object({
    KEYCLOAK_ISSUER: z.string().min(1, 'Missing KEYCLOAK_ISSUER'),
    KEYCLOAK_CLIENT_ID: z.string().min(1, 'Missing KEYCLOAK_CLIENT_ID'),
    KEYCLOAK_CLIENT_SECRET: z.string().min(1, 'Missing KEYCLOAK_CLIENT_SECRET')
});

const env = envSchema.parse(process.env);

export const keycloakProvider: Provider = KeycloakProvider({
    clientId: env.KEYCLOAK_CLIENT_ID,
    clientSecret: env.KEYCLOAK_CLIENT_SECRET,
    issuer: env.KEYCLOAK_ISSUER
});
