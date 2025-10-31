import { Processor, Worker } from 'bullmq';
import { queue, queueName } from './queue';
import { connection } from './connection';
import { FieldType } from '@packages/db/schemas/form/form-fields';
import { Form } from '@packages/db/schemas/form/form';

export type FieldResponse =
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
    responses: FieldResponse[];
};

export type FieldRuleLog = {
    type: 'rule';
    targetFieldId: string;
    leftValue: string | string[];
    operator: string;
    rightValue: string;
    result: boolean;
};

export type FieldRuleGroupLog = {
    type: 'group';
    combinator: string;
    result: boolean;
    score: number;
    logs: (FieldRuleLog | FieldRuleGroupLog)[];
};

export type CategoryRuleLog = {
    type: 'rule';
    leftValue: number;
    operator: string;
    rightValue: number;
    result: boolean;
};

export type CategoryRuleGroupLog = {
    type: 'group';
    combinator: string;
    result: boolean;
    logs: (CategoryRuleLog | CategoryRuleGroupLog)[];
};

export type CategoryScore = {
    categoryId: string;
    value: number;
};

export type FieldResponseResult = {
    fieldId: string;
    response: string | string[];
    fieldRuleLogs: FieldRuleGroupLog[];
    categoryRuleLogs: {
        categoryId: string;
        totalScore: number;
        assigned: boolean;
        logs: CategoryRuleGroupLog;
    }[];
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
