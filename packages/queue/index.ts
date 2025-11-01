import { Processor, Worker } from 'bullmq';
import { queue, queueName } from './queue';
import { connection } from './connection';
import { Form } from '@packages/db/schemas/form/form';
import { FieldResponse, FieldResponseResult } from 'src/lib/responses';

export type FieldResponseQueueJob = {
    form: Form;
    email: string | null;
    responses: FieldResponse[];
};

export type FieldResponseQueueJobResult = {
    formId: string;
    email: string;
    responses: FieldResponseResult[];
};

export type WorkerHandler = Processor<FieldResponseQueueJob, void, string>;

export async function createJob(name: string, data: FieldResponseQueueJob) {
    await queue.add(name, data);
}

export function createWorker(handler?: WorkerHandler) {
    return new Worker<FieldResponseQueueJob>(queueName, handler, { connection });
}
