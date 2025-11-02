import { Processor, Worker } from 'bullmq';
import { queue, queueName } from './queue';
import { connection } from './connection';
import { Form } from '@packages/db/schemas/form/form';
import { FieldType } from '@packages/db/schemas/form/form-fields';

export type FieldRawResponse =
    | {
          fieldId: string;
          fieldType: FieldType.TEXT;
          response: string;
          conditions: ('sentiment' | 'emotion')[];
      }
    | {
          fieldId: string;
          fieldType: FieldType.SELECTION;
          response: string | string[];
          conditions: 'answer'[];
      };

export type FieldResponseQueueJob = {
    form: Form;
    email: string | null;
    responses: FieldRawResponse[];
};

export type WorkerHandler = Processor<FieldResponseQueueJob, void, string>;

export async function createJob(name: string, data: FieldResponseQueueJob) {
    await queue.add(name, data);
}

export function createWorker(handler?: WorkerHandler) {
    return new Worker<FieldResponseQueueJob>(queueName, handler, { connection });
}
