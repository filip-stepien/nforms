import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import z from 'zod';
import EnvSchema from './schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);
