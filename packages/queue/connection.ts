import IORedis from 'ioredis';
import { env } from '../env';

const globalForRedis = globalThis as unknown as {
    redis: IORedis | undefined;
};

export const connection =
    globalForRedis.redis ??
    new IORedis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        maxRetriesPerRequest: null
    });

if (process.env.NODE_ENV !== 'production') {
    globalForRedis.redis = connection;
}
