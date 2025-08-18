import IORedis from 'ioredis';

const globalForRedis = globalThis as unknown as {
    redis: IORedis | undefined;
};

export const connection =
    globalForRedis.redis ??
    new IORedis({
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: null
    });

if (process.env.NODE_ENV !== 'production') {
    globalForRedis.redis = connection;
}
