import 'dotenv/config';
import z from 'zod';
import envSchema from './schema';

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
