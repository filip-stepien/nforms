import { Processor, Worker } from 'bullmq';
import { queue, queueName } from './queue';
import { connection } from './connection';

export type QueueJobData = {
    formId: string;
    fieldResponseId: string;
};

export type WorkerHandler = Processor<QueueJobData, void, string>;

export async function createJob(name: string, data: QueueJobData) {
    await queue.add(name, data);
}

export function createWorker(handler?: WorkerHandler) {
    return new Worker<QueueJobData>(queueName, handler, { connection });
}
