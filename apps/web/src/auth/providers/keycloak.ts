import { Provider } from 'next-auth/providers/index';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { env } from '@packages/env';

export const keycloakProvider: Provider = KeycloakProvider({
    clientId: env.KEYCLOAK_CLIENT_ID,
    issuer: env.KEYCLOAK_ISSUER,
    clientSecret: ''
});
