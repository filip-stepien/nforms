import { AuthOptions } from 'next-auth';
import { signIn } from './callbacks/signIn';
import { credentialsProvider } from './providers/credentials';
import { keycloakProvider } from './providers/keycloak';

const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 3600 // seconds
    },
    callbacks: { signIn },
    providers: [credentialsProvider, keycloakProvider]
};

export default authOptions;
