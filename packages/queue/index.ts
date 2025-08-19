import { Processor, Worker } from 'bullmq';
import { queue, queueName } from './queue';
import { connection } from './connection';

export type QueueJobData = {
    text: string;
};

export type QueueJobResult = {
    result: string;
};

export type WorkerHandler = Processor<QueueJobData, QueueJobData, string>;

export async function createJob(name: string, data: QueueJobData) {
    await queue.add(name, data);
}

export function createWorker(handler?: WorkerHandler) {
    return new Worker<QueueJobData, QueueJobData>(queueName, handler, { connection });
}
