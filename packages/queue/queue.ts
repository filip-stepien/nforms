import { Queue } from 'bullmq';
import { QueueJobData, QueueJobResult } from '.';

const globalForQueue = globalThis as unknown as {
    queue: Queue<QueueJobData, QueueJobResult> | undefined;
};

export const queueName = 'nlp';

export const queue = globalForQueue.queue ?? new Queue<QueueJobData, QueueJobResult>(queueName);

if (process.env.NODE_ENV !== 'production') {
    globalForQueue.queue = queue;
}
