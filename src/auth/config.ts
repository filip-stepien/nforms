import { AuthOptions } from 'next-auth';
import { signIn } from './callbacks/signIn';
import { jwt } from './callbacks/jwt';
import { session } from './callbacks/session';
import { credentialsProvider } from './providers/credentials';
import { keycloakProvider } from './providers/keycloak';

const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 3600 // seconds
    },
    callbacks: { signIn, jwt, session },
    providers: [credentialsProvider, keycloakProvider]
};

export default authOptions;
