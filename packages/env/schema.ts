import z from 'zod';

const envSchema = z.object({
    NODE_ENV: z.literal(['production', 'development']).default('development'),

    DATABASE_URL: z.string().min(1),

    SIGN_IN_URL: z.string().min(1),

    KEYCLOAK_ISSUER: z.string().min(1),
    KEYCLOAK_CLIENT_ID: z.string().min(1),
    KEYCLOAK_CLIENT_SECRET: z.string().min(1),

    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),

    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z
        .string()
        .transform(val => parseInt(val))
        .refine(val => Number.isInteger(val), { message: 'REDIS_PORT must be a number.' }),

    OLLAMA_MODEL: z.string().min(1),

    WIDGET_FORM_SUBMIT_URL: z.string().min(1),
    WIDGET_FORM_STRUCTURE_BASE_URL: z
        .string()
        .min(1)
        .transform(url => (url.endsWith('/') ? url : url + '/'))
});

export default envSchema;
