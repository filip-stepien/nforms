import { Processor, Worker } from 'bullmq';
import { queue, queueName } from './queue';
import { connection } from './connection';
import { FieldType } from '../db/schemas/form/form-fields';
import { FieldRules } from '@packages/db/schemas/form/field-rules';
import { RespondentCategory } from '@packages/db/schemas/form/respondent-categories';

export type FieldResponseData =
    | {
          fieldId: string;
          fieldType: FieldType.TEXT;
          response: string;
          requiredProcessings: ('sentiment' | 'emotion')[];
      }
    | {
          fieldId: string;
          fieldType: FieldType.SELECTION;
          response: string | string[];
          requiredProcessings: 'answer'[];
      };

export type FieldResponseQueueJobData = {
    formId: string;
    email: string | null;
    rules: FieldRules;
    categories: RespondentCategory[];
    responses: FieldResponseData[];
};

export type RuleLog = {
    type: 'rule';
    targetFieldId: string;
    leftValue: string | string[];
    operator: string;
    rightValue: string;
    result: boolean;
};

export type GroupLog = {
    type: 'group';
    combinator: string;
    result: boolean;
    logs: (RuleLog | GroupLog)[];
};

export type FieldResponseQueueJobResult = {
    formId: string;
    email: string;
    responses: {
        fieldId: string;
        scores: { categoryId: string; score: number }[];
        response: string | string[];
        logs: (RuleLog | GroupLog)[];
    }[];
};

export type WorkerHandler = Processor<FieldResponseQueueJobData, void, string>;

export async function createJob(name: string, data: FieldResponseQueueJobData) {
    await queue.add(name, data);
}

export function createWorker(handler?: WorkerHandler) {
    return new Worker<FieldResponseQueueJobData>(queueName, handler, { connection });
}
